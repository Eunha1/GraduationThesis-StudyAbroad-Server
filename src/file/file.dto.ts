export class offerLetterFile {
  certificate?: Express.Multer.File[];
  transcript?: Express.Multer.File[];
  citizen_identification_card?: Express.Multer.File[];
  ielts_certificate?: Express.Multer.File[];
  motivation_letter?: Express.Multer.File[];
}
export class offerLetterInfo {
  customer_phone: string;
  school_name: string;
  country: string;
  status: number;
}
export class visaFile {
  form?: Express.Multer.File[];
  CoE?: Express.Multer.File[];
  birth_certificate?: Express.Multer.File[];
  passport?: Express.Multer.File[];
  citizen_identification_card?: Express.Multer.File[];
  ielts_certificate?: Express.Multer.File[];
  offer_letter?: Express.Multer.File[];
  permanent_residence?: Express.Multer.File[];
  financial_records?: Express.Multer.File[];
}
export class visaInfo {
  customer_phone: string;
  country: string;
  status: number;
}
export class offerLetterRecord {
  customer_phone: string;
  school_name: string;
  country: string;
}
export class visaRecord {
  customer_phone: string;
  country: string;
}
