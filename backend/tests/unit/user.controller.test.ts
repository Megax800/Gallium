import { add } from "../../src/user/user.controller";
import { setORM } from "../../shared/db/orm";

describe("User Controller (unit)", () => {
  it("should return 400 if email exists", async () => {
    const mockORM = {
      em: {
        findOne: jest.fn().mockResolvedValue({ id: 1 }),
      },
    };

    setORM(mockORM as any);

    const req = {
      body: { email: "test@test.com" },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await add(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
