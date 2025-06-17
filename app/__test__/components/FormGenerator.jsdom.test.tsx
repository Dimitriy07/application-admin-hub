/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, fireEvent, screen } from "@testing-library/react";
import FormGenerator from "@/app/_components/FormGenerator";
import { FormConfigWithConditions } from "@/app/_types/types";

// Mocks
jest.mock("../../_components/DynamicFormFields", () => ({
  __esModule: true,
  default: ({ formFields }: any) => (
    <div data-testid="dynamic-form-fields">
      {Object.keys(formFields)
        .filter((key) => key !== "conditionalFields")
        .map((key) => (
          <div key={key} data-testid={`field-${key}`}>
            {key}
          </div>
        ))}
    </div>
  ),
}));

jest.mock("@/app/_hooks/useEditFormState", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/app/_hooks/useFormDefaults", () => ({
  __esModule: true,
  default: () => ({
    name: "John",
    email: "john@example.com",
  }),
}));

jest.mock("@/app/_lib/validationSchema", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const z = require("zod").z;
  return {
    __esModule: true,
    default: () =>
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
  };
});

jest.mock("next/navigation", () => ({
  usePathname: () =>
    "/applications/app123/entities/entity123/accounts/resources-app", // or whatever path is expected
  useSearchParams: () => new URLSearchParams("resourceType=users"),
}));

// Sample config
const formFields: FormConfigWithConditions = {
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
};

describe("FormGenerator", () => {
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form and form fields", () => {
    render(
      <FormGenerator
        formFields={formFields}
        onSubmit={onSubmit}
        formId="test-form"
        isEdit={false}
      />
    );

    expect(screen.getByTestId("dynamic-form-fields")).toBeInTheDocument();
    expect(screen.getByTestId("field-name")).toBeInTheDocument();
    expect(screen.getByTestId("field-email")).toBeInTheDocument();
  });

  it("prevents submit in edit mode if not dirty", async () => {
    render(
      <FormGenerator
        formFields={formFields}
        onSubmit={onSubmit}
        formId="edit-form"
        isEdit={true}
      />
    );

    const form = screen.getByRole("form", { name: "main-form" });
    await fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
