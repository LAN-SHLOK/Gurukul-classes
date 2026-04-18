// API Request/Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

export interface InquiryRequest {
  firstName: string;
  lastName: string;
  email: string;
  className: string;
  message?: string;
}

export interface AISearchRequest {
  query: string;
}

export interface AISearchResponse {
  answer: string;
}

export interface GoogleAuthRequest {
  credential: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface SetNewPasswordRequest {
  email: string;
  code: string;
  password: string;
}
