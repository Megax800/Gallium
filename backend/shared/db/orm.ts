import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MongoDriver } from "@mikro-orm/mongodb";

export const orm = await MikroORM.init({
  entities: ["dist/src/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  driver: MongoDriver,
  dbName: process.env.DB_NAME,
  clientUrl: process.env.DB_URL_STRING,
  highlighter: new MongoHighlighter(),
  debug: true,
});
