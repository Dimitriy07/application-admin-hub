import { FormConfig } from "../_types/types";

// TO REGISTER NEW USER
export const registrationFormFields: FormConfig = [
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
    type: "password",
    placeholder: "Password",
    id: "password",
    name: "password",
  },
  {
    type: "password",
    placeholder: "Confirm Password",
    id: "confirm",
    name: "confirm",
  },
  {
    type: "label",
    content: "Choose User Role",
    for: "role",
  },
  {
    type: "select",
    options: [
      { value: "", content: "Choose user role" },
      { value: "admin", content: "admin" },
      { value: "user", content: "user" },
    ],
    name: "role",
    id: "role",
  },
];

//TO LOGIN USER
export const loginFormFields: FormConfig = [
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
