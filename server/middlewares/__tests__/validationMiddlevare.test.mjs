import { validateData } from "../validationMiddleware.mjs";
import { z } from "zod";

describe("validateData", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call next if no schemas are provided", () => {
    validateData({})(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should validate the query if a query schema is provided", () => {
    const querySchema = z.object({
      page: z.number().positive(),
    });
    req.query = { page: "2" };
    validateData({ query: querySchema })(req, res, next);
    expect(req.query).toEqual({ page: "2" });
  });

  it("should validate the body if a body schema is provided", () => {
    const bodySchema = z.object({
      name: z.string().min(3),
    });
    req.body = { name: "John" };
    validateData({ body: bodySchema })(req, res, next);
    expect(req.body).toEqual({ name: "John" });
    expect(next).toHaveBeenCalled();
  });

  it("should return a 400 error if the data is invalid", () => {
    const bodySchema = z.object({
      age: z.number().positive(),
    });
    req.body = { age: -1 };
    validateData({ body: bodySchema })(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: {
        message: "Invalid data",
        details: [
          {
            name: "age",
            message: "Number must be greater than 0",
          },
        ],
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 500 error if an unexpected error occurs", () => {
    const errorMock = new Error("Unexpected error");
    const bodySchema = z.object({
      name: z.string(),
    });
    bodySchema.parse = jest.fn().mockImplementationOnce(() => {
      throw errorMock;
    });
    req.body = { name: "John" };
    validateData({ body: bodySchema })(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
