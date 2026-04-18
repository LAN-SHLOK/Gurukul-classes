// Database Models Types

export interface IInquiry {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  class_name: string;
  message?: string;
  created_at: Date;
}

export interface IStudent {
  _id?: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  gender: string;
  password: string;
  created_at: Date;
}

export interface IPasswordReset {
  email: string;
  code: string;
  expiresAt: number;
}

export interface IFaculty {
  _id?: string;
  name: string;
  role: string;
  expertise: string;
  image: string;
  bio?: string;
  created_at?: Date;
}

export interface IEvent {
  _id?: string;
  title: string;
  date: string;
  location?: string;
  category: string;
  image: string;
  description?: string;
  created_at?: Date;
}

export interface ITopper {
  _id?: string;
  name: string;
  score: string;
  year: string;
  exam: string;
  image: string;
  achievement?: string;
  created_at?: Date;
}
