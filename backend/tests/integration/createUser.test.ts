import request from "supertest";
import { app } from "../../src/app";

describe("User Controller (integration)", () => {
  it("should create a user", async () => {
    const res = await request(app).post("/users").send({
      name: "Octavio",
      email: "test@test.com",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@test.com");
  });

  it("should reject duplicate email", async () => {
    await request(app).post("/users").send({
      name: "User1",
      email: "dup@test.com",
    });

    const res = await request(app).post("/users").send({
      name: "User2",
      email: "dup@test.com",
    });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
