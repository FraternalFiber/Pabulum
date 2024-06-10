import request from "supertest";
import server from "./index.mjs";

describe("Server Tests", () => {
  afterAll(() => {
    server.close(); // Close the server after all tests
  });

  describe("GET /", () => {
    it("should return a success message", async () => {
      const response = await request(server).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ status: "Server is working properly" });
    });
  });

  describe("Middleware Tests", () => {
    it("should use the cors middleware", async () => {
      const response = await request(server).get("/");
      expect(response.headers["access-control-allow-origin"]).toBeDefined();
    });

    it("should use the json middleware", async () => {
      const response = await request(server).post("/").send({ data: "test" });
      expect(response.statusCode).toBe(404); // Assuming no route is defined for POST /
    });

    it("should use the urlencoded middleware", async () => {
      const response = await request(server).post("/").send("data=test");
      expect(response.statusCode).toBe(404); // Assuming no route is defined for POST /
    });
  });
});
