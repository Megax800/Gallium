import { MongoMemoryServer } from "mongodb-memory-server";
import { MikroORM } from "@mikro-orm/mongodb";
import mikroOrmConfig from "../../shared/db/mikro-orm.config";

let mongoServer: MongoMemoryServer;
let orm: MikroORM;

export const initTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();

  orm = await MikroORM.init({
    ...mikroOrmConfig,
    clientUrl: uri,
  });

  return orm;
};

export const closeTestDB = async () => {
  if (orm) await orm.close(true);
  if (mongoServer) await mongoServer.stop();
};
