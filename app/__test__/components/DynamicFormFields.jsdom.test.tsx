/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import DynamicFormFields from "@/app/_components/DynamicFormFields";
import { FormConfigWithConditions } from "@/app/_types/types";

// Mock FormRow
jest.mock("../../_components/FormRow", () => {
  const MockFormRow = ({ field, isEdit }: any) => (
    <div data-testid={`form-row-${field.name || field.labelName}`}>
      {field.labelName} - {isEdit ? "Edit" : "Add"}
    </div>
  );
  MockFormRow.displayName = "MockFormRow";
  return {
    __esModule: true,
    default: MockFormRow,
  };
});

const formFields: FormConfigWithConditions = {
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
        adminCode: {
          labelName: "Admin Code",
          name: "adminCode",
          type: "text",
          placeholder: "Enter admin code",
        },
      },
    },
  ],
} as unknown as FormConfigWithConditions;

describe("DynamicFormFields", () => {
  const register = jest.fn();
  const errors = {};
  const watchMock = jest.fn();

  it("renders normal fields", () => {
    render(
      <DynamicFormFields
        formFields={formFields}
        isEdit={false}
        register={register}
        errors={errors}
        watch={watchMock}
      />
    );

    expect(screen.getByTestId("form-row-name")).toBeInTheDocument();
  });

  it("renders conditional field when condition is met", () => {
    watchMock.mockImplementation((field: string) => {
      if (field === "role") return "admin";
      return "";
    });

    render(
      <DynamicFormFields
        formFields={formFields}
        isEdit={true}
        register={register}
        errors={errors}
        watch={watchMock}
      />
    );

    expect(screen.getByTestId("form-row-name")).toBeInTheDocument();
    expect(screen.getByTestId("form-row-adminCode")).toBeInTheDocument();
  });

  it("does NOT render conditional field when condition is NOT met", () => {
    watchMock.mockImplementation(() => "user");

    render(
      <DynamicFormFields
        formFields={formFields}
        isEdit={true}
        register={register}
        errors={errors}
        watch={watchMock}
      />
    );

    expect(screen.getByTestId("form-row-name")).toBeInTheDocument();
    expect(screen.queryByTestId("form-row-adminCode")).not.toBeInTheDocument();
  });
});
