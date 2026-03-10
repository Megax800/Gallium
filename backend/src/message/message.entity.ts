
export class Message{
    constructor(
        public id: number,
        public body: string,
        public date: Date,
        public time: Date,
        public sender: number,
        public receiver: number
    ){}
}