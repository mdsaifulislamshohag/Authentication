import { UserType } from './user.types';

export interface UserResponseInterface {
  code: number;
  msg: string;
  data: UserType & { token: string };
}
