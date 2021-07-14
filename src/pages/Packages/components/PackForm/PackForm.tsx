// @ts-nocheck

import { ReactNode, useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";

import {
  EuiButton,
  EuiButtonEmpty,
  EuiModal,
  EuiFormControlLayout,
  EuiButtonIcon,
  EuiFormRow,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiSelectable,
} from "@elastic/eui";

import { IPackage } from "services/packages/definitions";

import { ControlledEuiFieldText } from "components/ControlledComponents/ControlledEuiFieldText";
// import { ControlledEuiFieldNumber } from "components/ControlledComponents/ControlledEuiFieldNumber";
import { ControlledEuiSelect } from "components/ControlledComponents/ControlledEuiSelect";

import { ButtonsContainer, Container, StyledEuiForm, Title } from "./styles";
import { useBooks } from "services/books/books.hook";
import { IBook } from "services/books/definitions";

type Level = "Inicial" | "Primaria" | "Secundaria";
const levels: Level[] = ["Inicial", "Primaria", "Secundaria"];

const grades: Record<Level | "Default", number[]> = {
  Inicial: [3, 4, 5],
  Primaria: [1, 2, 3, 4, 5, 6],
  Secundaria: [1, 2, 3, 4, 5],
  Default: [],
};

type PackFormValues = IPackage;

type Props = {
  title: ReactNode;
  buttonTitle: ReactNode;
  pack?: IPackage;
  onSubmit: (data: IPackage) => void;
  onCancel: () => void;
};

type testType = React.ComponentProps<typeof EuiSelectable>["options"];

export function PackForm({
  title,
  buttonTitle,
  pack,
  onSubmit,
  onCancel,
}: Props) {
  const { handleSubmit, control, watch, reset } = useForm<PackFormValues>();

  const [isSearchBookModalVisible, setIsSearchBookModal] = useState(false);

  const { books } = useBooks();

  const [booksOptions, setBooksOptions] = useState<testType[]>([]);

  const [selectedBooks, setSelectedBooks] = useState<IBook[]>([]);

  useEffect(() => {
    if (books && booksOptions.length < 1) {
      setBooksOptions(
        books?.map((bk) => {
          return {
            label: bk.title,
            checked: undefined,
            disabled: false,
          };
        })
      );
    }
  }, [books, booksOptions.length]);

  useEffect(() => {
    reset({
      ...pack,
    });
    
  }, [pack, reset]);

  useEffect(() => {
    if (pack) {
      setBooksOptions((prev) =>
        prev?.map((pb) => {
          const inList =
            pack.books.findIndex((b) => b.title === pb.label) !== -1;
          return {
            ...pb,
            checked: inList ? "on" : undefined,
            disabled: inList,
          };
        })
      );
    }
  }, [pack, isSearchBookModalVisible]);

  const showSearchBookModal = () => setIsSearchBookModal(true);
  const closeSearchBookModal = () => setIsSearchBookModal(false);

  const handleSubmitForm = handleSubmit((data) => {
    onSubmit({
      ...data,
      books: pack ? pack.books : selectedBooks,
    });
  });

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirmAddBook = () => {
    closeSearchBookModal();
    const selectedOptions = booksOptions?.filter((bO) => bO.checked);

    if (pack) {
      selectedOptions?.forEach((sO) => {
        const tBook = books?.find((b) => b.title === sO.label);
        const sBook = pack.books.find((sB) => sB.id === tBook.id);
        if (!sBook) {
          pack.books.push(tBook as IBook);
        }
      });
    } else {
      selectedOptions?.forEach((sO) => {
        const tBook = books?.find((b) => b.title === sO.label);
        const sBook = selectedBooks.find((sB) => sB.id === tBook.id);
        if (!sBook) {
          selectedBooks.push(tBook as IBook);
        }
      });
    }

    setBooksOptions((prev) =>
      prev?.map((sO) => {
        return {
          ...sO,
          disabled: sO.checked ? true : false,
        };
      })
    );
  };

  const dropBookFromList = (book: IBook) => {
    if (pack) {
      const index = pack.books.findIndex((pBook) => pBook.id === book.id);
      pack.books.splice(index, 1);
    } else {
      setSelectedBooks((prev) => prev.filter((cBook) => cBook.id !== book.id));
    }

    setBooksOptions((prev) =>
      prev?.map((sO) => {
        if (sO.label === book.title) {
          return {
            ...sO,
            disabled: false,
            checked: undefined,
          };
        }
        return sO;
      })
    );
  };

  const watchLevel = watch("level");

  const gradesByLevel = grades[(watchLevel || "Default") as Level];

  return (
    <Container>
      <Title>{title}</Title>
      <StyledEuiForm component="form" onSubmit={handleSubmitForm}>
        <EuiFormRow label="Colegio">
          <ControlledEuiFieldText
            control={control}
            name="school"
            placeholder="Ingrese el nombre del colegio para este paquete"
          />
        </EuiFormRow>
        <EuiFormRow label="Nivel de Educacion">
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

        <EuiFormRow label="Libros">
          <EuiFormControlLayout
            append={
              <EuiButtonIcon
                onClick={showSearchBookModal}
                iconType="plusInCircle"
                aria-label="Next"
                color="primary"
              />
            }
          >
            <input
              type="text"
              className="euiFieldText"
              aria-label="Use aria labels when no actual label is in use"
              readOnly
              value="Agregar libro"
            />
          </EuiFormControlLayout>
        </EuiFormRow>

        {pack
          ? pack.books.map((book, index) => {
              return (
                <EuiFormRow key={index}>
                  <EuiFormControlLayout
                    append={
                      <EuiButtonIcon
                        onClick={() => dropBookFromList(book)}
                        iconType="trash"
                        aria-label="Next"
                        color="primary"
                      />
                    }
                  >
                    <input
                      type="text"
                      className="euiFieldText"
                      aria-label="Use aria labels when no actual label is in use"
                      readOnly
                      value={book.title}
                    />
                  </EuiFormControlLayout>
                </EuiFormRow>
              );
            })
          : selectedBooks.map((book, index) => {
              return (
                <EuiFormRow key={index}>
                  <EuiFormControlLayout
                    append={
                      <EuiButtonIcon
                        onClick={() => dropBookFromList(book)}
                        iconType="trash"
                        aria-label="Next"
                        color="primary"
                      />
                    }
                  >
                    <input
                      type="text"
                      className="euiFieldText"
                      aria-label="Use aria labels when no actual label is in use"
                      readOnly
                      value={book.title}
                    />
                  </EuiFormControlLayout>
                </EuiFormRow>
              );
            })}

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

      {isSearchBookModalVisible ? (
        <EuiModal onClose={closeSearchBookModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h1> Agregar libro </h1>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <EuiSelectable
              aria-label="Search book"
              searchable
              searchProps={{
                "data-test-subj": "selectableSearchHere",
              }}
              onChange={(newOptions) => setBooksOptions(newOptions)}
              options={booksOptions}
            >
              {(list, search) => (
                <Fragment>
                  {search}
                  {list}
                </Fragment>
              )}
            </EuiSelectable>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeSearchBookModal}>
              Cancel
            </EuiButtonEmpty>
            <EuiButton type="button" fill onClick={handleConfirmAddBook}>
              Save
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      ) : null}
    </Container>
  );
}
