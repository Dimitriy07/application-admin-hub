import { FormConfig } from "../_types/types";

export const registrationFormFields: FormConfig = {
  name: {
    type: "text",
    id: "name",
    name: "name",
    labelName: "Name",
    placeholder: "Name",
  },
  email: {
    type: "text",
    id: "email",
    name: "email",
    labelName: "Email",
    placeholder: "Email",
  },
  password: {
    type: "password",
    id: "password",
    name: "password",
    labelName: "Password",
    placeholder: "Password",
  },
  confirm: {
    type: "password",
    id: "confirm",
    name: "confirm",
    labelName: "Confirm Password",
    placeholder: "Confirm Password",
  },
  role: {
    type: "select",
    id: "role",
    name: "role",
    labelName: "Choose User Role",
    options: [
      { value: "", content: "Select Role" },
      { value: "admin", content: "Admin" },
      { value: "user", content: "User" },
    ],
  },
};

// //TO LOGIN USER
// export const loginFormFields: FormConfig = [
//   {
//     type: "label",
//     content: "Email:",
//     for: "email",
//   },
//   {
//     type: "email",
//     placeholder: "Email",
//     id: "email",
//     name: "email",
//   },
//   {
//     type: "label",
//     content: "Password:",
//     for: "password",
//   },
//   {
//     type: "text",
//     placeholder: "Password",
//     id: "password",
//     name: "password",
//   },
// ];

export const generalFormFields: FormConfig = {
  name: {
    type: "text",
    placeholder: "Item Name",
    id: "name",
    name: "name",
    labelName: "Name",
  },
};
