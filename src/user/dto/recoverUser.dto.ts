/* eslint-disable prettier/prettier */
import {IsEmail,IsNotEmpty} from 'class-validator';
export class RecoverUserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    verificationLink: string;
}