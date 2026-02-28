import { validateData } from "../validationMiddleware.mjs";
import { z } from "zod";

const createReq = () => ({
  query: {},
  body: {},
});

const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("validateData", () => {
  let logSpy;

  beforeAll(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  it("should call next if no schemas are provided", () => {
    const req = createReq();
    const res = createRes();
    const next = jest.fn();

    validateData({})(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should validate the query if a query schema is provided", () => {
    const querySchema = z.object({
      page: z.coerce.number().positive(),
    });
    const req = createReq();
    const res = createRes();
    const next = jest.fn();

    req.query = { page: "2" };

    validateData({ query: querySchema })(req, res, next);

    expect(req.query).toEqual({ page: 2 });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should validate the body if a body schema is provided", () => {
    const bodySchema = z.object({
      name: z.string().min(3),
    });
    const req = createReq();
    const res = createRes();
    const next = jest.fn();

    req.body = { name: "John" };

    validateData({ body: bodySchema })(req, res, next);

    expect(req.body).toEqual({ name: "John" });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should return a 400 error if the data is invalid", () => {
    const bodySchema = z.object({
      age: z.number().positive(),
    });
    const req = createReq();
    const res = createRes();
    const next = jest.fn();

    req.body = { age: -1 };

    validateData({ body: bodySchema })(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
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
    const bodySchema = {
      parse: jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      }),
    };
    const req = createReq();
    const res = createRes();
    const next = jest.fn();

    req.body = { name: "John" };

    validateData({ body: bodySchema })(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
