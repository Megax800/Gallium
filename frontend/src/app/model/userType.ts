import { NestedChatroomType } from './nestedChatroomType';

export type UserType = {
  id: string;
  nickname: string;
  firstname: string;
  lastname: string;
  email: string;
  passwd: string;
  chatrooms: NestedChatroomType[];
};
