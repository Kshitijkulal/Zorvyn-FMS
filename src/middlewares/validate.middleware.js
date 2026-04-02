export const validate = (schema) => (req, res, next) => {
  const isGet = req.method === "GET"

  const data = isGet ? req.query : req.body

  const result = schema.safeParse(data)

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten()
    })
  }

  if (isGet) {
    req.validatedQuery = result.data   
  } else {
    req.body = result.data         
  }

  next()
}