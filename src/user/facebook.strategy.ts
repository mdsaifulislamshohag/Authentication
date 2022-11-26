import { UserService } from './user.service';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>
  ) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "http://localhost:5000/api/user/facebook/redirect",
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails } = profile;

    var user =null;
       user = await this.userRepository.findOne({
          email: emails[0].value,
        },
       { select: ['id', 'name', 'email','last_login'] },

        );

        console.log({user})

        if(user && ((user.last_login==="google" && user.email ===emails[0].value)|| (user.last_login==="facebook" && user.email ===emails[0].value))){
          await this.userRepository.delete(user)
        }{
          const payload1 = {
            name: name.givenName + ' '+  name.familyName,
            email: emails[0].value,
            token:accessToken,
            password:accessToken,
            last_login:"facebook"
          };
        
          const response = {
            name: name.givenName + ' '+  name.familyName,
            email: emails[0].value,
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
