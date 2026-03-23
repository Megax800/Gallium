import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MongoDriver } from "@mikro-orm/mongodb";

export const orm = await MikroORM.init({
  entities: ["dist/src/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  driver: MongoDriver,
  dbName: "GalliumDB",
  clientUrl:
    "mongodb://api:j6lsMkxupD65LFad@ac-w1z8fr0-shard-00-00.mxknckm.mongodb.net:27017,ac-w1z8fr0-shard-00-01.mxknckm.mongodb.net:27017,ac-w1z8fr0-shard-00-02.mxknckm.mongodb.net:27017/?ssl=true&replicaSet=atlas-ej95gf-shard-0&authSource=admin&appName=GalliumDB",
  highlighter: new MongoHighlighter(),
  debug: true,
});
