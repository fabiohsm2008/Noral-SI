import { Control, Controller, Path } from "react-hook-form";

import { EuiFieldPassword } from "@elastic/eui";
import { EuiFieldPasswordProps } from "@elastic/eui/src/components/form/field_password/field_password";

type Props<T, TName> = {
  control: Control<T>;
  name: TName;
} & EuiFieldPasswordProps;

export function ControlledEuiFieldPassword<T, TName extends Path<T>>({
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
        <EuiFieldPassword
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          inputRef={ref}
          isInvalid={invalid}
          {...rest}
        />
      )}
    />
  );
}
