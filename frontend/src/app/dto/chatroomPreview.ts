import { UserIdNickname } from './userIdNickname';

export type ChatroomPreview = {
  id: string;
  users: UserIdNickname[];
  admin?: string;
  description?: string;
};
