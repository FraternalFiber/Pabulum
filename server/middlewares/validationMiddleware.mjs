import {ZodError} from "zod";

// Validate request body with a Zod schema. via https://dev.to/osalumense/validating-request-data-in-expressjs-using-zod-a-comprehensive-guide-3a0j
export function validateData(schema) {
    return (req, res, next) => {
        console.log('validateData');
        console.log('before', req.body);
        try {
            req.body = schema.parse(req.body);
            console.log('validateData: passed');
            next();
        }
        catch (error) {
            console.log('validateData/catch')
            if (error instanceof ZodError) {
                console.log('validateData/catch: zod error')
                const errorMessages = error.errors.map((issue) => ({
                    name: issue.path.join('.'),
                    message: issue.message
                }))
                res.status(400).json({success: false, message: {message: 'Invalid data', details: errorMessages}})
            }
            else {
                console.log('validateData/catch: other error')
                res.status(500).json({success: false, message: 'Internal server error'})
            }
        }
    }
}