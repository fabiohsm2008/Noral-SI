import { Control, Controller, Path } from "react-hook-form";

import { EuiFieldText } from "@elastic/eui";
import { EuiFieldTextProps } from "@elastic/eui/src/components/form/field_text/field_text";

type Props<T, TName> = {
  control: Control<T>;
  name: TName;
} & EuiFieldTextProps;

export function ControlledEuiFieldText<T, TName extends Path<T>>({
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
        <EuiFieldText
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
