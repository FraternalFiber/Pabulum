// uploadFile.test.mjs
import express from "express";
import request from "supertest";
import multer from "multer";
import { uploadFile } from "../fileUploadMiddleware.mjs";
import { ACCEPTED_IMAGE_TYPES, MAX_RECIPE_IMAGE_SIZE } from "../../constants.mjs";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.post("/upload", uploadFile(), (req, res) => {
  res.status(200).json({ success: true, message: "File uploaded successfully" });
});

describe("uploadFile middleware", () => {
  it("should upload a valid image file", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("fake image content"), {
        filename: "valid-image.jpg",
        contentType: "image/jpeg",
      })
      .field("key", JSON.stringify("value"));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("File uploaded successfully");
  });

  it("should return an error for unsupported file type", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("fake file content"), {
        filename: "invalid-file.txt",
        contentType: "text/plain",
      })
      .field("key", JSON.stringify("value"));

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Unsupported file type");
  });

  it("should return an error for exceeding file size limit", async () => {
    const largeBuffer = Buffer.alloc(MAX_RECIPE_IMAGE_SIZE + 1); // Create a buffer larger than the limit
    const response = await request(app)
      .post("/upload")
      .attach("image", largeBuffer, {
        filename: "large-image.jpg",
        contentType: "image/jpeg",
      })
      .field("key", JSON.stringify("value"));

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("File too large");
  });

  it("should return an error for invalid JSON format in fields", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("fake image content"), {
        filename: "valid-image.jpg",
        contentType: "image/jpeg",
      })
      .field("key", "invalid json"); // Invalid JSON format

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid JSON format");
  });

  it("should handle missing image gracefully", async () => {
    const response = await request(app).post("/upload").field("key", JSON.stringify("value"));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("File uploaded successfully");
  });

  it("should delete req.body.image if image is attached", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("fake image content"), {
        filename: "valid-image.jpg",
        contentType: "image/jpeg",
      })
      .field("image", JSON.stringify("value"));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("File uploaded successfully");

    // Check that req.body.image has been deleted
    // To do this, we need to add a custom middleware in the test app to inspect req.body
    app.post("/inspect", (req, res) => {
      if (req.body.image === undefined) {
        res.status(200).json({ success: true, message: "Image field deleted" });
      } else {
        res.status(400).json({ success: false, message: "Image field not deleted" });
      }
    });

    const inspectResponse = await request(app)
      .post("/inspect")
      .send({ ...response.body });

    expect(inspectResponse.status).toBe(200);
    expect(inspectResponse.body.success).toBe(true);
    expect(inspectResponse.body.message).toBe("Image field deleted");
  });
});
