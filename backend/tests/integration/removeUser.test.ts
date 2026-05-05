import request from "supertest";
import { app } from "../../src/app";

describe("DELETE /users/:id", () => {
  it("should delete a user", async () => {
    // 1. crear usuario
    const createRes = await request(app).post("/users").send({
      name: "To Delete",
      email: "delete@test.com",
    });

    const userId = createRes.body.id;

    // 2. eliminar
    const deleteRes = await request(app).delete(`/users/${userId}`);

    expect(deleteRes.status).toBe(200);

    // 3. verificar que ya no existe
    const getRes = await request(app).get(`/users/${userId}`);

    expect(getRes.status).toBe(404);
  });

  it("should return 404 if user does not exist", async () => {
    const res = await request(app).delete("/users/64f000000000000000000000");

    expect(res.status).toBe(404);
  });
});
