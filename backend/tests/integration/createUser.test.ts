import request from "supertest";
import { app } from "../../src/app";

describe("User Controller (integration)", () => {
  it("should create a user", async () => {
    const res = await request(app).post("/api/user").send({
      nickname: "testDude",
      firstname: "John",
      lastname: "Marlow",
      email: "test@test.com",
      passwd: "12345678",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("test@test.com");
  });

  it("should reject duplicate email", async () => {
    await request(app).post("/api/users").send({
      nickname: "testDude1",
      firstname: "John",
      lastname: "Marlow 1",
      email: "dup@mail.com",
      passwd: "12345678",
    });

    const res = await request(app).post("/api/users").send({
      nickname: "testDude2",
      firstname: "John",
      lastname: "Marlow 2",
      email: "dup@mail.com",
      passwd: "12345678",
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
