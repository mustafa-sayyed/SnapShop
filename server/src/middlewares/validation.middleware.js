import z from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    const result = z.safeParse(schema, req.body);
    console.log(req.body);

    if (!result.success) {
      return res.status(400).json({
        name: "Validation_Error",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }

    req.body = result.data;
    console.log("validation: ", result.data);

    next();
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;

    res
      .status(500)
      .json({ success: false, message: "Error while validating data", errorStack });
  }
};

export default validate;
