export interface ITokenPayload {
  user_id: number;
  username: string;
  role: string;
  exp: number;
  iat?: number;
  [key: string]: any;
}