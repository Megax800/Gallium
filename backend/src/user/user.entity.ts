
export class User{
    constructor(
        public id: number,
        public nickname: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public passwd: string
    ){}
}