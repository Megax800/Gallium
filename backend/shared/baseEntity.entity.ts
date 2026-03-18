import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/decorators/legacy";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity{
    @PrimaryKey()
    _id?: ObjectId = new ObjectId()

    @SerializedPrimaryKey({type: 'string'})
    id?: string
}