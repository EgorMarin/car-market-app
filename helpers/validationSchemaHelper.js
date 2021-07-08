module.exports = (schema) => async (req, res, next) => {
  try {
    if (schema instanceof Function) {
      const schemaObj = await schema(req);
      await schemaObj.validate(req.body);
    } else {
      await schema.validate(req.body);
    }
    next();
  } catch (e) {
    res.status(400).json({
      key: 'error.validation-failed',
      message: e,
    });
  }
};
