export interface RegisterPaylaod {
  firstName: string;
  lastName: string;
  identifier: string;
  imgUrls: string[];
}
export interface AuthLog {
  userId: string | null;
  timestamp: number;
  success: boolean;
  imageCapture: string;
}
