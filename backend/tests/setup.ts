process.env.NODE_ENV = "test";

import { initTestDB, closeTestDB } from "./setup/test-db";
import { setORM } from "../shared/db/orm";

let orm: any;

beforeAll(async () => {
  orm = await initTestDB();
  setORM(orm);
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  const db = orm.em.getConnection().getDb();
  const collections = await db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
