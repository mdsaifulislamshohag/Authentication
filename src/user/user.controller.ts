import {Body,Controller,Get,HttpStatus, Req,Post,Put,UseGuards,UsePipes,ValidationPipe, Param} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { GuardAuth } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { VerifyUserDto } from './dto/verifyUser.dto';
import { RecoverUserDto } from './dto/recoverUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { ResendCodeDto } from './dto/resendCode.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(GuardAuth)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserLoginResponse(user);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() loginDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto);
    return this.userService.buildUserLoginResponse(user);
  }

  @Post('/verify-registration')
  @UsePipes(new ValidationPipe())
  async verifyRegistration(
    @Body() resendCodeDto: ResendCodeDto,
  ): Promise<any> {
    const user = await this.userService.getVerificationCode(resendCodeDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('/confirm-registration/:verification_code')
  @UsePipes(new ValidationPipe())
  async getConfirmedRegistration(
     @Param('verification_code') verification_code: string,
  ): Promise<any> {
    return this.userService.getConfirmedRegistration(verification_code);
  }

  @Post('/confirm-registration')
  @UsePipes(new ValidationPipe())
  async saveConfirmedRegistration(
    @Body() verifyUserDto: VerifyUserDto,
  ): Promise<any> {
    verifyUserDto.email_verified = 'Yes';
    return this.userService.saveConfirmedRegistration(verifyUserDto);
  }

  @Post('/forget-password')
  @UsePipes(new ValidationPipe())
  async forgetPassword(
    @Body() recoverUserDto: RecoverUserDto,
  ): Promise<any> {
    await this.userService.forgetPassword(recoverUserDto);
    return {
      code: 200,
      msg: 'Your reset password code has been sent to your email. you can use it to recover your password ',
    };
  }

  @Post('/recover-password')
  @UsePipes(new ValidationPipe())
  async recoverPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    await this.userService.recoverPassword(resetPasswordDto);
    return {
      code: 200,
      msg: 'Your password is updated.',
    };
  }

  @Put()
  @UseGuards(GuardAuth)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildUserUpdateResponse(user);
  }

  
  @Get("/google")
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.userService.googleLogin(req)
  }

  
  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("/facebook/redirect")
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user
    };

}
}
