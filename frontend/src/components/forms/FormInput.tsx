import { Input } from "@nextui-org/react";
import {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  isRequired?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  isRequired,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Input
        {...register(name)}
        type={type}
        label={label}
        placeholder={placeholder}
        isRequired={isRequired}
        errorMessage={error?.message}
        isInvalid={!!error}
      />
    </div>
  );
}
