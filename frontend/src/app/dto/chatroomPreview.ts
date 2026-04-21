export type ChatroomPreview = {
  id: string;
  users: { id: string; nickname: string }[];
  admin?: string;
  description?: string;
};
