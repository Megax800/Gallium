import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config.js";

let ormInstance: MikroORM | null = null;

export const initORM = async () => {
  if (!ormInstance) {
    ormInstance = await MikroORM.init(mikroOrmConfig);
  }
  return ormInstance;
};

export const setORM = (orm: MikroORM) => {
  ormInstance = orm;
};

export const getORM = async () => {
  if (!ormInstance) {
    ormInstance = await MikroORM.init(mikroOrmConfig);
  }
  return ormInstance;
};
