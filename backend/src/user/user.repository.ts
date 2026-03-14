import { Repository } from "../../shared/repository";
import { User } from "./user.entity";
import { db } from "../../shared/db/conn.js";
import { ObjectId } from "mongodb";

const users =db.collection<User>("users")

export class userRepository implements Repository<User>{
    public async findAll(): Promise <User[] | undefined> {
        return await users.find().toArray()
    }

    public async findOne(item: { id: string }): Promise <User | undefined> {
        const _id = new ObjectId(item.id)
        return (await users.findOne({_id})) || undefined
    }

    public async add(item: User): Promise <User | undefined> {
        item._id = (await users.insertOne(item)).insertedId
        return item
    }

    public async update(id: string, item: User): Promise <User | undefined> {
        const _id = new ObjectId(id)
        return (await users.findOneAndUpdate({_id}, {$set: item}, {returnDocument: 'after'})) || undefined
    }

    public async delete(item: { id: string }): Promise <User | undefined> {
        const _id = new ObjectId(item.id)
        return(await users.findOneAndDelete({_id})) || undefined
    }
}