import { Repository } from "../../shared/repository";
import { Message } from "./message.entity";
import { db } from "../../shared/db/conn.js";
import { ObjectId } from "mongodb";

const messages =db.collection<Message>("messages")

export class messageRepository implements Repository<Message>{
    public async findAll(): Promise <Message[] | undefined> {
        return await messages.find().toArray()
    }

    public async findOne(item: { id: string }): Promise <Message | undefined> {
        const _id = new ObjectId(item.id)
        return (await messages.findOne({_id})) || undefined
    }

    public async add(item: Message): Promise <Message | undefined> {
        item._id = (await messages.insertOne(item)).insertedId
        return item
    }

    public async update(id: string ,item: Message): Promise <Message | undefined> {
        const _id = new ObjectId(id)
        return (await messages.findOneAndUpdate({_id}, {$set: item}, {returnDocument: 'after'})) || undefined
    }

    public async delete(item: { id: string }): Promise <Message | undefined> {
        const _id = new ObjectId(item.id)
        return(await messages.findOneAndDelete({_id})) || undefined
    }
}