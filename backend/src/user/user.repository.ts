import { Repository } from "../../shared/repository";
import { User } from "./user.entity";

export class userRepository implements Repository<User>{
    public findAll(): User[] | undefined {
        return
    }

    public findOne(item: { id: string; }): User | undefined {
        return
    }

    public add(item: User): User | undefined {
        return
    }

    public update(item: User): User | undefined {
        return
    }

    public delete(item: { id: string; }): User | undefined {
        return
    }
}