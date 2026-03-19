import Joi from "joi";

export const htmlToPdfSchema = Joi.object({
  html: Joi.string().min(1),
  htmlParts: Joi.array().items(Joi.string().min(1)).min(1),
}).xor("html", "htmlParts");

