import { ObjectId } from "mongodb";
import crypto from "node:crypto"

export class User{
    constructor(
        public nickname: string,
        public firstname: string,
        public lastname: string,
        public email: string,
        public passwd: string,
        public _id?: ObjectId,
    ){}
}