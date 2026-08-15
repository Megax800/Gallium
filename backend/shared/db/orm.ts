import { MikroORM } from "@mikro-orm/mongodb";
import config from "./mikro-orm.config.js";

let ormInstance: any = null;

export const initORM = async () => {
  if (ormInstance) return ormInstance;

  if (process.env.NODE_ENV === "test") {
    throw new Error("Use initTestDB instead of initORM in tests");
  }

  ormInstance = await MikroORM.init(config as any);
  return ormInstance;
};

export const setORM = (orm: any) => {
  ormInstance = orm;
};

export const getORM = async () => {
  if (!ormInstance) {
    throw new Error("ORM not initialized");
  }
  return ormInstance;
};
