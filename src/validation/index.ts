import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("username is required!")
      .min(5, "username must be at least 5 characters!"),
    email: yup
      .string()
      .required("email is required!")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a valid email address"),
    password: yup
      .string()
      .required("password is required!")
      .min(6, "Password should be at least 6 charachters."),
  })
  .required();

export const loginSchema = yup
  .object({
    identifier: yup
      .string()
      .required("email is required!")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a valid email address"),
    password: yup
      .string()
      .required("password is required!")
      .min(6, "Password should be at least 6 charachters."),
  })
  .required();
