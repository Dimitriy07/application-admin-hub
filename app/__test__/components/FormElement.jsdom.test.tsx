import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormElement from "@/app/_components/FormElement";

describe("FormElement component", () => {
  it("renders an input element for types other than 'select'", () => {
    render(
      <FormElement
        type="text"
        className="input-class"
        id="test-input"
        name="testName"
        disabled={false}
        placeholder="Enter text"
      />
    );

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveClass("input-class");
    expect(input).toHaveAttribute("id", "test-input");
    expect(input).toHaveAttribute("name", "testName");
    expect(input).not.toBeDisabled();
  });

  it("renders a select element with options when type is 'select'", () => {
    const options = [
      { value: "1", content: "Option 1" },
      { value: "2", content: "Option 2" },
      { value: undefined, content: "No value" }, // test undefined value option
    ];

    render(
      <FormElement
        key={Math.random()}
        type="select"
        className="select-class"
        id="test-select"
        name="selectName"
        disabled={true}
        options={options}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveClass("select-class");
    expect(select).toHaveAttribute("id", "test-select");
    expect(select).toHaveAttribute("name", "selectName");
    expect(select).toBeDisabled();

    options.forEach((option) => {
      const optionEl = screen.getByText(option.content);
      expect(optionEl).toBeInTheDocument();
      if (option.value !== undefined) {
        expect(optionEl).toHaveValue(option.value);
      } else {
        // for undefined value option, HTML option value defaults to empty string
        expect(optionEl).toHaveValue();
      }
    });
  });

  it("calls onChange handler on input change", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <FormElement
        type="text"
        className="input-class"
        id="test-input"
        name="testName"
        onChange={onChange}
      />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    expect(onChange).toHaveBeenCalled();
  });

  it("calls onChange handler on select change", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <FormElement
        type="select"
        className="select-class"
        id="test-select"
        name="selectName"
        options={[
          { value: "1", content: "Option 1" },
          { value: "2", content: "Option 2" },
        ]}
        onChange={onChange}
      />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "2");

    expect(onChange).toHaveBeenCalled();
  });
});
