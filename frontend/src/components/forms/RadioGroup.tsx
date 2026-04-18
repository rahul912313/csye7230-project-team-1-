import { Radio, RadioGroup as NextUIRadioGroup } from "@nextui-org/react";
import { useController, Control, FieldValues, Path } from "react-hook-form";

interface RadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: { label: string; value: string }[];
  control: Control<T>;
  error?: any;
}

export function RadioGroup<T extends FieldValues>({
  name,
  label,
  options,
  control,
  error,
}: RadioGroupProps<T>) {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div className="flex flex-col gap-1.5">
      <NextUIRadioGroup
        label={label}
        value={field.value}
        onValueChange={field.onChange}
        isInvalid={!!error}
        errorMessage={error?.message}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </NextUIRadioGroup>
    </div>
  );
}
