import { FormSchema } from "../_types/types";

// TO REGISTER NEW USER
export const registrationFormSchema: FormSchema = [
  {
    type: "label",
    content: "Name",
    for: "name",
  },
  {
    type: "input",
    placeholder: "Name",
    id: "name",
    name: "name",
  },
  {
    type: "label",
    content: "Email",
    for: "email",
  },
  {
    type: "email",
    placeholder: "Email",
    id: "email",
    name: "email",
  },
  {
    type: "label",
    content: "Password",
    for: "password",
  },
  {
    type: "input",
    placeholder: "Password",
    id: "password",
    name: "password",
  },
];

//TO LOGIN USER
export const loginFormSchema = [
  {
    type: "label",
    content: "Email",
    for: "email",
  },
  {
    type: "email",
    placeholder: "Email",
    id: "email",
    name: "email",
  },
  {
    type: "label",
    content: "Password",
    for: "password",
  },
  {
    type: "input",
    placeholder: "Password",
    id: "password",
    name: "password",
  },
];
