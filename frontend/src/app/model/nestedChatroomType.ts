export type NestedChatroomType = {
  id: string;
  messages: string[];
  users: string[];
  admin?: string;
  chatname?: string;
  isGroup?: boolean;
  description?: string;
};
