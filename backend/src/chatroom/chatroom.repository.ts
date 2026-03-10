import { Repository } from "../../shared/repository";
import { Chatroom } from "./chatroom.entity";

export class chatroomRepository implements Repository<Chatroom>{
    public findAll(): Chatroom[] | undefined {
        return 
    }

    public findOne(item: { id: string; }): Chatroom | undefined {
        return
    }

    public add(item: Chatroom): Chatroom | undefined {
        return
    }

    public update(item: Chatroom): Chatroom | undefined {
        return
    }

    public delete(item: { id: string; }): Chatroom | undefined {
        return
    }
}