import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { MongoDriver } from "@mikro-orm/mongodb";

export const orm = await MikroORM.init({
    entities: ['dist/src/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    driver: MongoDriver,
    dbName: 'GalliumDB',
    clientUrl: 'mongodb+srv://api:j6lsMkxupD65LFad@galliumdb.mxknckm.mongodb.net/?appName=GalliumDB',
    highlighter: new MongoHighlighter(),
    debug: true,
})