/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import FormRow from "@/app/_components/FormRow";
import type { FormElementType } from "@/app/_types/types";

jest.mock("../../_components/FormElement", () => ({
  __esModule: true,
  default: (props: any) => {
    return <input data-testid="form-element" {...props} />;
  },
}));

const mockField: FormElementType = {
  type: "text",
  id: "name",
  name: "name",
  labelName: "Name",
  placeholder: "Enter name",
};

const TestFormRow = ({
  field,
  isEdit,
  errors = {},
}: {
  field: FormElementType;
  isEdit: boolean;
  errors?: any;
}) => {
  const methods = useForm<FormElementType>();
  return (
    <FormProvider {...methods}>
      <form>
        <FormRow
          field={field}
          isEdit={isEdit}
          register={methods.register}
          errors={errors}
        />
      </form>
    </FormProvider>
  );
};

describe("FormRow", () => {
  it("renders label and input", () => {
    render(<TestFormRow field={mockField} isEdit={true} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByTestId("form-element")).toBeInTheDocument();
  });

  it("renders error message if present", () => {
    const errors = {
      name: { message: "Name is required" },
    };

    render(<TestFormRow field={mockField} isEdit={true} errors={errors} />);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("disables input if not in edit mode", () => {
    render(<TestFormRow field={mockField} isEdit={false} />);

    expect(screen.getByTestId("form-element")).toBeDisabled();
  });
});
