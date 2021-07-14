import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EuiButton, EuiButtonEmpty, EuiFormRow } from "@elastic/eui";

import { IBook } from "services/books/definitions";

import { ControlledEuiFieldText } from "components/ControlledComponents/ControlledEuiFieldText";
import { ControlledEuiFieldNumber } from "components/ControlledComponents/ControlledEuiFieldNumber";
import { ControlledEuiSelect } from "components/ControlledComponents/ControlledEuiSelect";

import { ButtonsContainer, Container, StyledEuiForm, Title } from "./styles";

import { IEditorial } from "../../definitions";

const editorials: IEditorial[] = [
  {
    id: "1",
    name: "San marcos",
  },
  {
    id: "2",
    name: "Norma",
  },
  {
    id: "3",
    name: "Crecer",
  },
  {
    id: "4",
    name: "Bruño",
  },
  {
    id: "5",
    name: "San Pablo",
  },
  {
    id: "6",
    name: "Santillana",
  },
  {
    id: "7",
    name: "Dimarclass",
  },
  {
    id: "8",
    name: "Edinium",
  },
  {
    id: "9",
    name: "Maya editorial",
  },
  {
    id: "10",
    name: "Lexicom",
  },
];

type Level = "INICIAL" | "PRIMARIA" | "SECUNDARIA";

const levels: Level[] = ["INICIAL", "PRIMARIA", "SECUNDARIA"];

const grades: Record<Level | "DEFAULT", number[]> = {
  INICIAL: [3, 4, 5],
  PRIMARIA: [1, 2, 3, 4, 5, 6],
  SECUNDARIA: [1, 2, 3, 4, 5],
  DEFAULT: [],
};

type BookFormValues = IBook;

type Props = {
  title: ReactNode;
  buttonTitle: ReactNode;
  book?: IBook;
  onSubmit: (data: IBook) => void;
  onCancel: () => void;
};

export function BookForm({
  title,
  buttonTitle,
  book,
  onSubmit,
  onCancel,
}: Props) {
  const { handleSubmit, control, watch, reset } = useForm<BookFormValues>();

  useEffect(() => {
    reset({
      ...book,
      price: book?.price ? book?.price / 100 : 0,
    });
  }, [book, reset]);

  const handleSubmitForm = handleSubmit((data) => {
    onSubmit(data);
  });

  const handleCancel = () => {
    onCancel();
  };

  const watchLevel = watch("level");

  const gradesByLevel = grades[(watchLevel || "DEFAULT") as Level];

  return (
    <Container>
      <Title>{title}</Title>
      <StyledEuiForm component="form" onSubmit={handleSubmitForm}>
        <EuiFormRow label="Nombre">
          <ControlledEuiFieldText
            control={control}
            name="title"
            placeholder="Ingrese el nombre del libro"
          />
        </EuiFormRow>
        <EuiFormRow label="Editorial">
          <ControlledEuiSelect
            control={control}
            name="editorial"
            hasNoInitialSelection
            options={editorials.map((editorial) => ({
              value: editorial.name,
              text: editorial.name,
            }))}
          />
        </EuiFormRow>
        <EuiFormRow label="Nivel">
          <ControlledEuiSelect
            control={control}
            name="level"
            hasNoInitialSelection
            options={levels.map((level) => ({
              value: level,
              text: level,
            }))}
          />
        </EuiFormRow>
        <EuiFormRow label="Grado">
          <ControlledEuiSelect
            control={control}
            name="grade"
            hasNoInitialSelection
            options={gradesByLevel.map((grade) => ({
              value: grade,
              text: grade,
            }))}
          />
        </EuiFormRow>
        <EuiFormRow label="Precio">
          <ControlledEuiFieldNumber
            control={control}
            placeholder="Ingrese el precio del libro"
            prepend="S/"
            name="price"
          />
        </EuiFormRow>
        <EuiFormRow label="Imagen">
          <ControlledEuiFieldText
            control={control}
            placeholder="https://i.picsum.photos/id/866/200/300.jpg"
            name="cover"
          />
        </EuiFormRow>
        <EuiFormRow>
          <ButtonsContainer>
            <EuiButtonEmpty onClick={() => handleCancel()}>
              Cancelar
            </EuiButtonEmpty>
            <EuiButton type="submit" fill>
              {buttonTitle}
            </EuiButton>
          </ButtonsContainer>
        </EuiFormRow>
      </StyledEuiForm>
    </Container>
  );
}
