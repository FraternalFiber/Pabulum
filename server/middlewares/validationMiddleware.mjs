import { ZodError } from "zod";

// Validate request body with a Zod schema. via https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j
export function validateData(schemas) {
  return (req, res, next) => {
    try {
      // Perform validation via Zod schema
      if (schemas.query) {
        console.log("validate query");
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.body) {
        console.log("validate body");
        req.body = schemas.body.parse(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          name: issue.path.join("."),
          message: issue.message,
        }));
        res
          .status(400)
          .json({ success: false, message: { message: "Invalid data", details: errorMessages } });
      } else {
        console.log("validateData/catch: other error");
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  };
}
