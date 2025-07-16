export const registrationFormFields = {
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

  conditionalFields: [
    {
      when: { field: "role", value: "admin" },
      fields: {
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
      },
    },
  ],
};

export const loginFormField = {
  email: {
    type: "email",
    name: "email",
    id: "email",
    labelName: "E-mail",
  },
  password: {
    type: "password",
    name: "password",
    id: "password",
    labelName: "Password",
  },
};

export const generalFormFields = {
  name: {
    type: "text",
    placeholder: "Item Name",
    id: "name",
    name: "name",
    labelName: "Name",
  },
};
