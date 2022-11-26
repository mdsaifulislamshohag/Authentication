/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare, hash } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { getRandomNumber } from '../utils/common';
import * as urlEncrypt from 'url-encrypt';
import { ResendCodeDto } from './dto/resendCode.dto';
const axios = require('axios');



@Injectable()
export class UserService {

  constructor(@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>, private readonly configService: ConfigService
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
    console.log(process.env.SEND_GRID_KEY);
  }
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    var number = getRandomNumber()
    createUserDto.verificationLink = number.toString();
    createUserDto.email_verified = 'NO'
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    // const userByname = await this.userRepository.findOne({
    //   name: createUserDto.name,
    // });

    const verificationLink = await this.userRepository.findOne({
      verificationLink: createUserDto.verificationLink,
    });
    if (userByEmail) {
      throw new HttpException(
        'Email is already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    //console.log({newUser});
    return await this.userRepository.save(newUser);
  }


  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }


  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      { select: ['id', 'name', 'email', 'photo', 'password', 'email_verified'] },
    );


    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.email_verified !== "Yes") {
      throw new HttpException(
        'You will need to verify your account before login',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
  async saveConfirmedRegistration(
    verifyUserDto: VerifyUserDto,
  ): Promise<any> {
    var user = null;
    const verificationCode = await this.userRepository.findOne({
      verificationLink: verifyUserDto.verificationLink,
    });

    if (!verificationCode) {
      throw new HttpException(
        'verification code does not matched',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      user = await this.userRepository.findOne(verificationCode);
      Object.assign(user, verifyUserDto);
      await this.userRepository.save(user);

      return {
        code: 200,
        msg: "You are now verified. Please login.",
      }
    }
  }

  async getConfirmedRegistration(
    verification_code: string,
  ): Promise<any> {
    // var user =null;

    console.log(verification_code)

    const user = await this.userRepository.findOne({
      verificationLink: verification_code,
    });

    if (!user) {
      throw new HttpException(
        'verification code does not matched',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      let verifyUserDto = {
        verificationLink: "verified",
        email_verified: "yes"
      }
      Object.assign(user, verifyUserDto);
      await this.userRepository.save(user);

      return {
        code: 200,
        msg: "You are now verified. Please login.",
      }
    }
  }

  async getVerificationCode(
    resendCodeDto: ResendCodeDto
  ): Promise<any> {
    var user = null;

    const userByEmail = await this.userRepository.findOne({
      email: resendCodeDto.email,
    },
      { select: ['id', 'name', 'email'] },
    );
    var number = getRandomNumber()
    resendCodeDto.verificationLink = number.toString();
    resendCodeDto.email_verified = 'NO'
    console.log(resendCodeDto)
    if (!userByEmail) {
      throw new HttpException(
        'User does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      var number = getRandomNumber()
      resendCodeDto.verificationLink = number.toString();
      resendCodeDto.email_verified = 'NO'
      //const newUser = new UserEntity();
      Object.assign(userByEmail, resendCodeDto);
      return await this.userRepository.save(userByEmail);

    }
  }

  async forgetPassword(recoverUserDto): Promise<any> {
    //console.log({API_KEY});
    var number;
    var user = null;
    user = await this.userRepository.findOne({
      email: recoverUserDto.email,
    },
      { select: ['id', 'name', 'email'] },

    );

    if (!user) {
      throw new HttpException(
        'No record we found at this moment',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      number = getRandomNumber();
      recoverUserDto.verificationLink = number.toString();
      Object.assign(user, recoverUserDto);

    
      try {
        let object = {
          "customer_name": user.name,
          "email": user.email,
          "reset_password_code": number
        }

        const uri = encodeURI(
          `${process.env.resetPasswordSendingMailApi}`
        );

        let result = await axios.post(uri, object, {
          headers: {
            "X-APP-KEY": `${process.env.mailSeningHeardersKey}`,
          }
        }
        );

        if (result.data) {
          return {
            code: 200,
            msg:  "Your reset password code has been sent to your email. you can use it to recover your password ",
          }
        } else {
          return {
            code: 400,
            msg: `Oops!, Something went wrong with sending mail!`,
          }
        }
      } catch (error) {
        console.log("error", error);
      }
      return await this.userRepository.save(user);
    }
  }

  async recoverPassword(
    resetPasswordDto
  ): Promise<any> {
    var user = null;
    user = await this.userRepository.findOne({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new HttpException(
        'No record we found at this moment',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {

      resetPasswordDto.password = await hash(resetPasswordDto.password, 10);
      Object.assign(user, resetPasswordDto);
      await this.userRepository.save(user);
    }
  }


  generateJwt(user: UserEntity): string {
    return sign({
      id: user.id,
      name: user.name,
      email: user.email
    }, JWT_SECRET);
  }


  async send(mail: SendGrid.MailDataRequired) {
    console.log(mail);
    const transport = await SendGrid.send(mail);
    
    return transport;
  }

  async buildUserResponse(user: UserEntity) {
    

    try {
      const encryptor = urlEncrypt({ secretKey: `${process.env.urlEncryptionKey}`, expiredAfterSeconds: 3 });
      let url = encryptor.encrypt(`${process.env.verifyRegistrationUrl}${user.verificationLink}`)

      let object = {
        "customer_name": user.name,
        "email": user.email,
        "verify_link": url,
        "verify_code": user.verificationLink
      }

      const uri = encodeURI(
        `${process.env.registrationMailSendingApi}`
      );

      let result = await axios.post(uri, object, {
        headers: {
          "X-APP-KEY": `${process.env.mailSeningHeardersKey}`,
        }
      }
      );

      if (result.data) {
        return {
          code: 200,
          msg: "A verification code has been sent to your email. please verify your account before login ",
        }
      } else {
        return {
          code: 400,
          msg: `Oops!, Something went wrong with sending mail!`,
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }


  buildUserLoginResponse(user: UserEntity): UserResponseInterface {
    return {

      code: 200,
      msg: "You have successfully logged in.",
      data: {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }
  buildUserUpdateResponse(user: UserEntity): UserResponseInterface {
    return {

      code: 200,
      msg: "user updated successfully.",
      data: {
        ...user,
        token: this.generateJwt(user)
      }
    }
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }
}


