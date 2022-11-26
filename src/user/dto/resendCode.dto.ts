import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendCodeDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

   verificationLink: string;
   email_verified: string;
}
