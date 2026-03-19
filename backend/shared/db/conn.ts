import { MongoClient, Db } from "mongodb";

const uri =
  "mongodb://api:j6lsMkxupD65LFad@ac-w1z8fr0-shard-00-00.mxknckm.mongodb.net:27017,ac-w1z8fr0-shard-00-01.mxknckm.mongodb.net:27017,ac-w1z8fr0-shard-00-02.mxknckm.mongodb.net:27017/?ssl=true&replicaSet=atlas-ej95gf-shard-0&authSource=admin&appName=GalliumDB";

const cli = new MongoClient(uri);
await cli.connect();

export let db: Db = cli.db("GalliumDB");
