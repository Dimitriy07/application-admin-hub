/* eslint-disable @typescript-eslint/no-explicit-any */
type SelectOption = {
  value?: string;
  content: string;
};

// FOR INFORMATION WHAT IS USED IN FORM ELEMENTS
interface FormElementProps {
  type: string;
  placeholder?: string;
  id?: string;
  name?: string;
  options?: ReadonlyArray<SelectOption> | undefined;
  disabled?: boolean;
  className?: string;
  // FOR REGISTER PROPS ONLY
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  ref?: React.Ref<any>;
}

function FormElement({
  type,
  options,
  className,
  ...rest
}: FormElementProps &
  React.InputHTMLAttributes<HTMLInputElement> &
  React.SelectHTMLAttributes<HTMLSelectElement>) {
  if (type === "select" && options) {
    return (
      <select {...rest} className={className}>
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.content}
          </option>
        ))}
      </select>
    );
  }

  return <input type={type} {...rest} className={className} />;
}

export default FormElement;
