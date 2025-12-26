import z from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    const result = z.safeParse(schema, req.body);
    if (!result.success) {
      return res.status(400).json({
        name: "Validation_Error",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }

    req.body = result.data;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error while validating data" });
  }
};


export default validate;