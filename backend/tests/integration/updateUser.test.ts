import request from "supertest";
import { app } from "../../src/app";

describe("PUT /users/:id", () => {
  it("should update a user", async () => {
    // 1. crear usuario
    const createRes = await request(app).post("/users").send({
      name: "Original",
      email: "update@test.com",
    });

    const userId = createRes.body.id;

    // 2. actualizar
    const updateRes = await request(app).put(`/users/${userId}`).send({
      name: "Updated Name",
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe("Updated Name");
  });

  it("should return 404 if user does not exist", async () => {
    const res = await request(app)
      .put("/users/64f000000000000000000000") // id fake
      .send({ name: "Test" });

    expect(res.status).toBe(404);
  });
});
