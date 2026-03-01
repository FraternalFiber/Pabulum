import request from "supertest";
import server from "./index.mjs";
import { PORT, HOST } from "./constants.mjs";

describe("Server Tests", () => {
  let logSpy;

  beforeAll((done) => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    if (!server.listening) {
      server.listen(PORT, HOST, done);
    } else {
      done();
    }
  });

  afterAll((done) => {
    logSpy.mockRestore();

    if (server.listening) {
      server.close(done);
      return;
    }

    done();
  });

  it("should start the server and listen on the correct hostname and port", () => {
    expect(server.listening).toBe(true);
    const address = server.address();
    expect(address.address).toBe(HOST);
    expect(address.port).toBe(PORT);
  });

  describe("Different methods handling", () => {
    it("GET / should return a success message", async () => {
      const response = await request(server)
        .get("/");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ status: "Server is working properly" });
    });

    it("POST / should return 404", async () => {
      const response = await request(server).post("/");
      expect(response.statusCode).toBe(404);
    });

    it("PUT / should return 404", async () => {
      const response = await request(server).put("/");
      expect(response.statusCode).toBe(404);
    });

    it("DELETE / should return 404", async () => {
      const response = await request(server).delete("/");
      expect(response.statusCode).toBe(404);
    });
  });

  it("should allow cross-origin requests with CORS", async () => {
    const response = await request(server)
      .get("/")
      .set("Origin", "http://localhost:3000");

    expect(response.statusCode).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("*");
  });

  describe("Error handling tests", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(server)
        .get("/non-existent-route");
      expect(response.statusCode).toBe(404);
    });
  });

  describe("Environment variables", () => {
    it("should have PORT defined", () => {
      expect(PORT).toBeDefined();
      expect(typeof PORT).toBe("number");
    });

    it("should have HOST defined", () => {
      expect(HOST).toBeDefined();
      expect(typeof HOST).toBe("string");
    });

    it("should have valid PORT value", () => {
      expect(PORT).toBeGreaterThan(0);
      expect(PORT).toBeLessThan(65536);
    });

    it("should have valid HOST value", () => {
      expect(HOST).toMatch(/^[\w\.\-:]+$/);
    });
  });
});
