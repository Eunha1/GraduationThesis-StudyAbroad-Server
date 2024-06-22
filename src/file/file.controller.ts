import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  visaInfo,
  offerLetterFile,
  offerLetterInfo,
  visaFile,
  offerLetterRecord,
  visaRecord,
  pagination,
} from './file.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { storageConfig } from '../helpers/config';
import { dateFormat } from 'src/utils/dateFormat';
import { extname } from 'path';
import { VisaFile } from './file.schema';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/enum/roles.enum';
import { RoleGuard } from 'src/role/role.guard';

@Controller('api/file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('upload/offer-letter-file')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'certificate' },
        { name: 'transcript' },
        { name: 'citizen_identification_card' },
        { name: 'ielts_certificate' },
        { name: 'motivation_letter' },
      ],
      {
        storage: storageConfig('offer-letter'),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
      },
    ),
  )
  async uploadOfferLetterFile(
    @Req() req: any,
    @UploadedFiles() files: offerLetterFile,
    @Body() offerLetterInfo: offerLetterInfo,
  ) {
    if (
      !offerLetterInfo.customer_phone ||
      offerLetterInfo.customer_phone == ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điền thông tin phone của khách hàng',
      };
    }
    if (
      !(
        files.certificate ||
        files.citizen_identification_card ||
        files.ielts_certificate ||
        files.motivation_letter ||
        files.transcript
      )
    ) {
      return {
        status: 0,
        message: 'Vui lòng tải file ',
      };
    }
    console.log(files);
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.uploadOfferLetterFile(files, offerLetterInfo);
  }

  @Post('upload/visa-file')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'form' },
        { name: 'CoE' },
        { name: 'birth_certificate' },
        { name: 'passport' },
        { name: 'citizen_identification_card' },
        { name: 'ielts_certificate' },
        { name: 'offer_letter' },
        { name: 'permanent_residence' },
        { name: 'financial_records' },
      ],
      {
        storage: storageConfig('visa'),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
      },
    ),
  )
  async uploadVisaFile(
    @Req() req: any,
    @UploadedFiles() files: visaFile,
    @Body() visaInfo: visaInfo,
  ) {
    if (!visaInfo.customer_phone || visaInfo.customer_phone == '') {
      return {
        status: 0,
        message: 'Vui lòng điền thông tin phone của khách hàng',
      };
    }
    if (
      !(
        files.form ||
        files.CoE ||
        files.birth_certificate ||
        files.citizen_identification_card ||
        files.financial_records ||
        files.ielts_certificate ||
        files.offer_letter ||
        files.passport ||
        files.permanent_residence
      )
    ) {
      return {
        status: 0,
        message: 'Vui lòng tải file ',
      };
    }
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.uploadVisaFile(files, visaInfo);
  }

  @Get('offer-letter-file')
  @UseGuards(AuthGuard)
  async getListOfferLetter(@Body() pagination: pagination) {
    return await this.service.getListOfferLetter(pagination);
  }

  @Get('visa-file')
  @UseGuards(AuthGuard)
  async getListVisaFile(@Body() pagination: pagination) {
    return await this.service.getListVisaFile(pagination);
  }

  @Get('offer-letter/:id')
  @UseGuards(AuthGuard)
  async getOfferLetterById(@Param('id') offerLetter_id: string) {
    return await this.service.getOfferLetterFileById(offerLetter_id);
  }

  @Get('visa-file/:id')
  @UseGuards(AuthGuard)
  async getVisaFileById(@Param('id') visaFile_id: string) {
    return await this.service.getVisaFileById(visaFile_id);
  }

  @Post('offer-letter/update-status/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async updateStatusOfferLetterFile(
    @Param('id') offerLetterId: string,
    @Body() data: any,
  ) {
    if (!data.newStatus || data.newStatus === '') {
      return {
        status: 0,
        message: 'Vui lòng điển trạng thái mới',
      };
    }
    return await this.service.updateStatusOfferLetterFile(
      offerLetterId,
      data.newStatus,
    );
  }

  @Post('visa-file/update-status/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async updateStatusVisaFile(@Param('id') visaId: string, @Body() data: any) {
    if (!data.newStatus || data.newStatus === '') {
      return {
        status: 0,
        message: 'Vui lòng điển trạng thái mới',
      };
    }
    return await this.service.updateStatusVisaFile(visaId, data.newStatus);
  }

  @Post('/update/offer-letter/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'certificate' },
        { name: 'transcript' },
        { name: 'citizen_identification_card' },
        { name: 'ielts_certificate' },
        { name: 'motivation_letter' },
      ],
      {
        storage: storageConfig('record/offer-letter'),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
      },
    ),
  )
  async updateOfferLetterFile(
    @Req() req: any,
    @UploadedFiles() files: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.updateOfferLetterFile(id, files, body);
  }

  @Post('/update/visa-file/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'form' },
        { name: 'CoE' },
        { name: 'birth_certificate' },
        { name: 'passport' },
        { name: 'citizen_identification_card' },
        { name: 'ielts_certificate' },
        { name: 'offer_letter' },
        { name: 'permanent_residence' },
        { name: 'financial_records' },
      ],
      {
        storage: storageConfig('visa'),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
      },
    ),
  )
  async updateVisaFile(
    @Req() req: any,
    @UploadedFiles() files: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.updateVisaFile(id, files, body);
  }
  @Post('/upload/offer-letter')
  @Roles(Role.ADMISSION_OFFICER, Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'offer_letter' }], {
      storage: storageConfig('record/offer-letter'),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
          callback(null, false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async updateOfferLetter(
    @Req() req: any,
    @UploadedFiles() files: { offer_letter?: Express.Multer.File[] },
    @Body() offerLetterRecord: offerLetterRecord,
  ) {
    if (
      !offerLetterRecord.customer_phone ||
      offerLetterRecord.customer_phone == ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điền thông tin phone của khách hàng',
      };
    }
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.uploadOfferLetter(files, offerLetterRecord);
  }

  @Post('/upload/visa')
  @Roles(Role.ADMISSION_OFFICER, Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'visa' }], {
      storage: storageConfig('record/visa'),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
          callback(null, false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async uploadVisa(
    @Req() req: any,
    @UploadedFiles() files: { visa?: Express.Multer.File[] },
    @Body() visaRecord: visaRecord,
  ) {
    if (!visaRecord.customer_phone || visaRecord.customer_phone === '') {
      return {
        status: 0,
        message: 'Vui lòng điền thông tin phone của khách hàng',
      };
    }
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.uploadVisa(files, visaRecord);
  }

  @Get('/record/offer-letter')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async getRecordOfferLetter(@Body() pagination: pagination) {
    return await this.service.getRecordOfferLetter(pagination);
  }

  @Get('/record/visa')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async getRecordVisa(@Body() pagination: pagination) {
    return await this.service.getRecordVisa(pagination);
  }

  @Get('/record/offer-letter/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async getRecordOfferLetterById(@Param('id') offer_letter: string) {
    return await this.service.getRecordOfferLetterById(offer_letter);
  }

  @Get('/record/visa/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async getRecordVisaById(@Param('id') visa: string) {
    return await this.service.getRecordVisaById(visa);
  }

  @Post('/record/update/offer-letter/:id')
  @Roles(Role.ADMISSION_OFFICER, Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'offer_letter' }], {
      storage: storageConfig('record/offer-letter'),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
          callback(null, false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async updateRecordOfferLetter(
    @Req() req: any,
    @UploadedFiles() files: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    console.log(body);
    return await this.service.updateRecordOfferLetter(id, files, body);
  }

  @Post('/record/update/visa/:id')
  @Roles(Role.ADMISSION_OFFICER, Role.EDU_COUNSELLOR)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'visa' }], {
      storage: storageConfig('record/visa'),
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp', '.pdf'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
          callback(null, false);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async updateRecordVisa(
    @Req() req: any,
    @UploadedFiles() files: any,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.updateRecordVisa(id, files, body);
  }
  @Post('/delete/offer-letter-file/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOfferLetterFile(@Param('id') offer_letterId: string) {
    return await this.service.deleteOfferLetterFile(offer_letterId);
  }

  @Post('/delete/visa-file/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteVisaFile(@Param('id') visaId: string) {
    return await this.service.deleteVisaFile(visaId);
  }

  @Post('/delete/offer-letter-record/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteOfferLetterRecord(@Param('id') offerLetter: string) {
    return await this.service.deleteOfferLetterRecord(offerLetter);
  }

  @Post('/delete/visa-record/:id')
  @Roles(Role.EDU_COUNSELLOR, Role.ADMISSION_OFFICER)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteVisaRecord(@Param('id') visa: string) {
    return await this.service.deleteVisaRecord(visa);
  }
}
