import { Control, Controller, Path } from "react-hook-form";

import { EuiDatePicker } from "@elastic/eui";
import { EuiDatePickerProps } from "@elastic/eui/src/components/date_picker/date_picker";

type Props<T, TName> = {
  control: Control<T>;
  name: TName;
} & EuiDatePickerProps;

export function ControlledEuiDatePicker<T, TName extends Path<T>>({
  control,
  name,
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
        const handleChange = (event) => {
          onChange(event.format("YYYY-MM-DD"));
        };
        return (
          <EuiDatePicker
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
