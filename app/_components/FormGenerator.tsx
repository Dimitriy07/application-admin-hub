import { FormSchema } from "../_types/types";

interface FormGeneratorProps {
  formSchema: FormSchema;
}

function FormGenerator({ formSchema }: FormGeneratorProps) {
  return (
    <form className="flex flex-col">
      {formSchema.map((schema, i) => {
        if (schema.type === "label")
          return (
            <label key={i} htmlFor={schema.for}>
              {schema.content}
            </label>
          );
        if (schema.type === "input")
          return (
            <input
              key={i}
              id={schema.id}
              name={schema.name}
              placeholder={schema.placeholder}
            />
          );
        if (schema.type === "email")
          return (
            <input
              key={i}
              id={schema.id}
              name={schema.name}
              placeholder={schema.placeholder}
            />
          );
      })}
    </form>
  );
}

export default FormGenerator;
