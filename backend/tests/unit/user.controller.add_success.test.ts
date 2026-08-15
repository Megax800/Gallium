import { add } from "../../src/user/user.controller";
import { setORM } from "../../shared/db/orm";
import { jest } from "@jest/globals";
import { User } from "../../src/user/user.entity";

describe("User Controller (unit)", () => {
  it("should create a new user and return 201", async () => {
    const mockUser = Object.assign(new User(), {
      nickname: "testDude",
      firstname: "John",
      lastname: "Marlow",
      email: "test@test.com",
      passwd: "12345678",
    });

    const mockEM = {
      // No existe usuario previo
      find: jest.fn<() => Promise<any>>().mockResolvedValue([]),

      // Simula creación de entidad
      create: jest.fn().mockReturnValue(mockUser),

      // Simula persistencia
      flush: jest.fn<() => Promise<any>>().mockResolvedValue(undefined),
    };

    const mockORM = {
      em: {
        fork: jest.fn().mockReturnValue(mockEM),
      },
    };

    setORM(mockORM as any);

    const req = {
      body: {
        sanitizeInput: mockUser,
      },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await add(req, res);

    // Verifica búsqueda de email
    expect(mockEM.find).toHaveBeenCalled();

    // Verifica creación
    expect(mockEM.create).toHaveBeenCalled();

    // Verifica persistencia
    expect(mockEM.flush).toHaveBeenCalled();

    // Verifica respuesta
    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      data: mockUser,
    });
  });
});
