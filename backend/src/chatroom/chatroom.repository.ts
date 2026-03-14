import { Repository } from "../../shared/repository.js";
import { Chatroom } from "./chatroom.entity.js";
import { db } from "../../shared/db/conn.js";
import { ObjectId } from "mongodb";

const chatrooms =db.collection<Chatroom>("chatrooms")

export class chatroomRepository implements Repository<Chatroom>{
    public async findAll(): Promise <Chatroom[] | undefined> {
        return await chatrooms.find().toArray()
    }

    public async findOne(item: { id: string }): Promise <Chatroom | undefined> {
        const _id = new ObjectId(item.id)
        return (await chatrooms.findOne({_id})) || undefined
    }

    public async add(item: Chatroom): Promise <Chatroom | undefined> {
        item._id = (await chatrooms.insertOne(item)).insertedId
        return item
    }

    public async update(id: string, item: Chatroom): Promise <Chatroom | undefined> {
        const _id = new ObjectId(id)
        return (await chatrooms.findOneAndUpdate({_id}, {$set: item}, {returnDocument: 'after'})) || undefined
    }

    public async delete(item: { id: string }): Promise <Chatroom | undefined> {
        const _id = new ObjectId(item.id)
        return(await chatrooms.findOneAndDelete({_id})) || undefined
    }
}