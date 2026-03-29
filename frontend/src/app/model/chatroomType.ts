import { NestedMessageType } from './nestedMessageType';
import { NestedUserType } from './nestedUserType';

export type ChatroomType = {
  id: string;
  messages: NestedMessageType[];
  users: NestedUserType[];
  admin?: string;
  chatname?: string;
  isGroup?: boolean;
  description?: string;
};
