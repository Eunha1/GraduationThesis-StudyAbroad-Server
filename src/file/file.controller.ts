import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
} from './file.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { storageConfig } from '../../helpers/config';
import { dateFormat } from 'utils/dateFormat';
import { extname } from 'path';
import { VisaFile } from './file.schema';

@Controller('api/file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('upload/offer-letter-file')
  @UseGuards(AuthGuard)
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
        storage: storageConfig('offer-letter', dateFormat()),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
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
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.uploadOfferLetterFile(files, offerLetterInfo);
  }

  @Post('upload/visa-file')
  @UseGuards(AuthGuard)
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
        storage: storageConfig('visa', dateFormat()),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
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
  async getListOfferLetter() {
    return await this.service.getListOfferLetter();
  }

  @Get('visa-file')
  @UseGuards(AuthGuard)
  async getListVisaFile() {
    return await this.service.getListVisaFile();
  }

  @Get('offer-letter/:offerLetter_id')
  @UseGuards(AuthGuard)
  async getOfferLetterById(@Param('offerLetter_id') offerLetter_id: string) {
    return await this.service.getOfferLetterFileById(offerLetter_id);
  }

  @Get('visa-file/:visa_id')
  @UseGuards(AuthGuard)
  async getVisaFileById(@Param('visa_id') visaFile_id: string) {
    return await this.service.getVisaFileById(visaFile_id);
  }

  @Put('offer-letter/update-status/:offerLetter_id')
  @UseGuards(AuthGuard)
  async updateStatusOfferLetterFile(
    @Param('offerLetter_id') offerLetterId: string,
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

  @Put('visa-file/update-status/:visa_id')
  @UseGuards(AuthGuard)
  async updateStatusVisaFile(
    @Param('visa_id') visaId: string,
    @Body() data: any,
  ) {
    if (!data.newStatus || data.newStatus === '') {
      return {
        status: 0,
        message: 'Vui lòng điển trạng thái mới',
      };
    }
    return await this.service.updateStatusVisaFile(visaId, data.newStatus);
  }
}
