import { Control, Controller, Path } from "react-hook-form";

import { EuiFieldNumber } from "@elastic/eui";
import { EuiFieldNumberProps } from "@elastic/eui/src/components/form/field_number/field_number";

type Props<T, TName> = {
  control: Control<T>;
  name: TName;
} & EuiFieldNumberProps;

export function ControlledEuiFieldNumber<T, TName extends Path<T>>({
  control,
  name,
  ...rest
}: Props<T, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, name, ref },
        fieldState: { invalid },
      }) => (
        <EuiFieldNumber
          inputRef={ref}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          isInvalid={invalid}
          {...rest}
        />
      )}
    />
  );
}
