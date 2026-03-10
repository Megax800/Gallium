import { Repository } from "../../shared/repository";
import { Message } from "./message.entity";

export class messageRepository implements Repository<Message>{
    public findAll(): Message[] | undefined {
        return
    }

    public findOne(item: { id: string; }): Message | undefined {
        return
    }

    public add(item: Message): Message | undefined {
        return
    }

    public update(item: Message): Message | undefined {
        return
    }

    public delete(item: { id: string; }): Message | undefined {
        return
    }
}