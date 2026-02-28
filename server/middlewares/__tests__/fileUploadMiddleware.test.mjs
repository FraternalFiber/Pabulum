import express from "express";
import request from "supertest";
import { uploadFile } from "../fileUploadMiddleware.mjs";
import { MAX_RECIPE_IMAGE_SIZE } from "../../constants.mjs";

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.post("/upload", uploadFile(), (req, res) => {
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      body: req.body,
      filePresent: Boolean(req.file),
      hasImageField: Object.prototype.hasOwnProperty.call(req.body, "image"),
    });
  });

  return app;
};

describe("uploadFile middleware", () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

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
    expect(response.body.filePresent).toBe(true);
    expect(response.body.body.key).toBe("value");
    expect(response.body.hasImageField).toBe(false);
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
    expect(response.body.filePresent).toBe(false);
    expect(response.body.body.key).toBe("value");
    expect(response.body.hasImageField).toBe(false);
  });

  it("should delete req.body.image when image is attached", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", Buffer.from("fake image content"), {
        filename: "valid-image.jpg",
        contentType: "image/jpeg",
      })
      .field("image", JSON.stringify("value"))
      .field("key", JSON.stringify("value"));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("File uploaded successfully");
    expect(response.body.filePresent).toBe(true);
    expect(response.body.body.key).toBe("value");
    expect(response.body.hasImageField).toBe(false);
  });
});
