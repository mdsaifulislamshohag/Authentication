import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyUserDto {
  //@IsNotEmpty()
  verificationLink: string;
  email_verified: string;
}
