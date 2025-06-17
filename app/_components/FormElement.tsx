/**
 * FormElement Component
 *
 * A flexible form input component that dynamically renders either a standard `<input>` or a `<select>` element
 * depending on the provided `type` prop. This abstraction is useful for form generators or reusable form elements.
 *
 * @component
 * @example <caption>Input usage</caption>
 * <FormElement
 *   type="text"
 *   name="username"
 *   id="username"
 *   className="input-class"
 *   placeholder="Enter your name"
 * />
 *
 * @example <caption>Select usage</caption>
 * <FormElement
 *   type="select"
 *   name="country"
 *   id="country"
 *   className="select-class"
 *   options={[
 *     { value: "car", content: "Car" },
 *     { value: "truck", content: "Truck" },
 *   ]}
 * />
 *
 * @typedef {Object} SelectOption
 * @property {string} [value] - Optional value to be submitted for the option.
 * @property {string} content - Text to be shown in the dropdown.
 *
 * @typedef {Object} FormElementBaseProps
 * @property {string} className - CSS class for styling.
 * @property {string} id - Unique identifier for the input/select.
 * @property {string} name - Form field name.
 * @property {boolean} disabled - Whether the element is disabled.
 *
 * @typedef {Object} InputProps
 * @property {string} type - Input type (e.g. "text", "email", "number"). Must not be "select".
 * @property {...React.InputHTMLAttributes<HTMLInputElement>} - Additional native input attributes.
 *
 * @typedef {Object} SelectProps
 * @property {"select"} type - Must be the string "select" to render a <select>.
 * @property {SelectOption[]} options - Options to be rendered inside the <select>.
 * @property {...React.SelectHTMLAttributes<HTMLSelectElement>} - Additional native select attributes.
 *
 * @param {FormElementProps} props - Either `InputProps` or `SelectProps`.
 * @returns JSX.Element - A styled `<input>` or `<select>` element.
 */

import React from "react";

type SelectOption = {
  value?: string;
  content: string;
};

type FormElementBaseProps = {
  className: string;
  id: string;
  name: string;
  disabled: boolean;
};

type InputProps = Partial<FormElementBaseProps> &
  React.InputHTMLAttributes<HTMLInputElement> & {
    type: Exclude<React.HTMLInputTypeAttribute, "select">;
  };

type SelectProps = Partial<FormElementBaseProps> &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    type: "select";
    options: SelectOption[];
  };

type FormElementProps = InputProps | SelectProps;

function FormElement(props: FormElementProps) {
  const { className, ...rest } = props;

  if (props.type === "select") {
    const { options, ...selectProps } = rest as SelectProps;
    return (
      <select {...selectProps} className={className}>
        {options.map((option, index) => (
          <option
            key={option.value ?? `${option.content}-${index}`}
            value={option.value}
          >
            {option.content}
          </option>
        ))}
      </select>
    );
  }

  return <input {...(rest as InputProps)} className={className} />;
}

export default FormElement;
