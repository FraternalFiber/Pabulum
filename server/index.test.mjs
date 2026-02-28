import request from "supertest";
import server from "./index.mjs";

describe("Server Tests", () => {
  let logSpy;

  beforeAll(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll((done) => {
    logSpy.mockRestore();

    if (server.listening) {
      server.close(done);
      return;
    }

    done();
  });

  it("GET / should return a success message", async () => {
    const response = await request(server)
      .get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "Server is working properly" });
  });

  it("should allow cross-origin requests with CORS", async () => {
    const response = await request(server)
      .get("/")
      .set("Origin", "http://localhost:3000");

    expect(response.statusCode).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });
});
