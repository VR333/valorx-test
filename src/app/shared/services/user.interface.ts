export interface IUser {
  name: string;
  age: number;
}

export interface MockUser {
  id: number;
  contact_name: string;
  email: string;
  phone_number: string;
}

export interface MockResponce {
  data: MockUser[];
  total: number;
}

export interface MockParams {
  start: number;
  end: number;
}
