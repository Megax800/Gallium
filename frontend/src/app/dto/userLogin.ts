export type UserLogin = {
  id: string;
  nickname: string;
  firstname: string;
  lastname: string;
  email: string;
  chatrooms: { id: string; chatname: string }[];
};
