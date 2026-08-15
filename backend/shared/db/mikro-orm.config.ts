import { MongoDriver } from "@mikro-orm/mongodb";

const config = {
  driver: MongoDriver,

  dbName: process.env.DB_NAME,
  clientUrl: process.env.DB_URL_STRING,

  entities: ["dist/src/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  debug: true,
};

export default config;
