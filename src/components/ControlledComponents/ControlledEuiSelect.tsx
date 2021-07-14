import { Control, Controller, Path } from "react-hook-form";

import { EuiSelect } from "@elastic/eui";
import { ChangeEventHandler } from "react";
import { EuiSelectProps } from "@elastic/eui/src/components/form/select/select";

type Props<T, TName> = {
  control: Control<T>;
  name: TName;
  onChange?: (text: string) => void;
} & EuiSelectProps;

export function ControlledEuiSelect<T, TName extends Path<T>>({
  control,
  name,
  onChange: listenerOnChange,
  ...rest
}: Props<T, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, name, ref, value },
        fieldState: { invalid },
      }) => {
        const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
          onChange(event.target.value);
          if (listenerOnChange) {
            listenerOnChange(event.target.value);
          }
        };
        return (
          <EuiSelect
            inputRef={ref}
            onChange={handleChange}
            onBlur={onBlur}
            name={name}
            isInvalid={invalid}
            value={value as string}
            {...rest}
          />
        );
      }}
    />
  );
}
