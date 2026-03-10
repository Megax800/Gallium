
export class Chatroom{
    constructor(
        public id: number,
        public admin: number[],
        public chatname: string,
        public isGroup: boolean,
        public description: string
    ){}
}