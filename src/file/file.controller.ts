import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { offerLetterFile, visaFile } from './file.dto';

@Controller('api/file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('upload/offer-letter-file')
  @UseGuards(AuthGuard)
  async uploadOfferLetterFile(@Body() offerLetterFile: offerLetterFile) {
    if (
      !offerLetterFile.customer_phone ||
      offerLetterFile.customer_phone == ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điền thông tin phone của khách hàng',
      };
    }
    return await this.service.uploadOfferLetterFile(offerLetterFile);
  }

  @Post('upload/visa-file')
  @UseGuards(AuthGuard)
  async uploadVisaFile(@Body() visaFile: visaFile) {
    if (!visaFile.customer_phone || visaFile.customer_phone == '') {
      return {
        status: 0,
        message: 'Vui lòng điền thông tin phone của khách hàng',
      };
    }
    return await this.service.uploadVisaFile(visaFile);
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
}
