import { z } from "zod";

const createSpecialtyValidationSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
});

export const specialtiesValidation = {
  createSpecialtyValidationSchema,
};
