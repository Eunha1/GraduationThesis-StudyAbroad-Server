export class createStaffDto {
  email: string;
  password: string;
  role: string;
}

export class updateStaffInfo {
  name: string;
  phone: string;
  avatar: string;
  address: string;
}

export class pagination {
  page: number;
  limit: number;
}
