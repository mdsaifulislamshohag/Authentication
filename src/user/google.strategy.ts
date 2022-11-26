import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>
  )  {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:5000/api/user/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    var user =null;
    user = await this.userRepository.findOne({
       email: emails[0].value,
     },
    { select: ['id', 'name', 'email','last_login'] },
     );
     if(user && ((user.last_login==="facebook" && user.email ===emails[0].value)|| (user.last_login==="google" && user.email ===emails[0].value))){
        await this.userRepository.delete(user)
     }{
      const payload1 = {
        name: name.givenName + ' '+  name.familyName,
        email: emails[0].value,
        token:accessToken,
        password:accessToken,
        photo: photos[0].value,  
        last_login:"google"
      };
      const response = {
        name: name.givenName + ' '+  name.familyName,
        email: emails[0].value,
        photo: photos[0].value,    
        token:accessToken,
      };
      done(null, response);
        const newUser = new UserEntity();
        Object.assign(newUser, payload1);
        //console.log({newUser});
         await this.userRepository.save(newUser);
     }
    
  }
}