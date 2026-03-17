import { MongoClient, Db } from "mongodb"

const uri = 'mongodb+srv://api:j6lsMkxupD65LFad@galliumdb.mxknckm.mongodb.net/?appName=GalliumDB'

const cli = new MongoClient(uri)
await cli.connect()

export let db:Db = cli.db('GalliumDB')