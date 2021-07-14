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
  EuiFieldNumber,
} from "@elastic/eui";

import { IKardex } from "services/kardex/definitions";

import {
  bookInKardexToBackend,
  IBookInKardexToBackend,
} from "services/bookInKardex/bookInKardex";

import { ControlledEuiFieldText } from "components/ControlledComponents/ControlledEuiFieldText";
import { ControlledEuiDatePicker } from "components/ControlledComponents/ControlledEuiDatePicker";
import { ControlledEuiSelect } from "components/ControlledComponents/ControlledEuiSelect";

import {
  ButtonsContainer,
  Container,
  StyledEuiForm,
  Title,
  KardexData,
  KardexBooks,
} from "./styles";
import { useBooks } from "services/books/books.hook";
import { IBook } from "services/books/definitions";

type documentTypes = "GUIA DE REMISION" | "NOTA DE INGRESO" | "NOTA DE SALIDA";
const documentsType: documentTypes[] = [
  "GUIA DE REMISION",
  "NOTA DE INGRESO",
  "NOTA DE SALIDA",
];

type kardexTypes = "INGRESS" | "EGRESS";
const kardexsType: kardexTypes[] = ["INGRESS", "EGRESS"];

type KardexFormValues = IBookInKardexToBackend;

type Props = {
  title: ReactNode;
  buttonTitle: ReactNode;
  kardex?: IKardex;
  onSubmit: (data: IKardex) => void;
  onCancel: () => void;
};

type testType = React.ComponentProps<typeof EuiSelectable>["options"];

export function KardexForm({
  title,
  buttonTitle,
  kardex,
  onSubmit,
  onCancel,
}: Props) {
  const { handleSubmit, control, reset } = useForm<KardexFormValues>();

  const [isSearchBookModalVisible, setIsSearchBookModal] = useState(false);

  const { books } = useBooks();

  const [booksOptions, setBooksOptions] = useState<testType[]>([]);

  const [selectedBooks, setSelectedBooks] = useState<bookInKardexToBackend[]>(
    []
  );

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
      ...kardex,
    });
  }, [kardex, reset]);

  useEffect(() => {
    if (kardex) {
      setBooksOptions((prev) =>
        prev?.map((pb) => {
          const inList =
            kardex.books.findIndex((b) => b.title === pb.label) !== -1;
          return {
            ...pb,
            checked: inList ? "on" : undefined,
            disabled: inList,
          };
        })
      );
    }
  }, [kardex, isSearchBookModalVisible]);

  const showSearchBookModal = () => setIsSearchBookModal(true);
  const closeSearchBookModal = () => setIsSearchBookModal(false);

  const handleSubmitForm = handleSubmit((data) => {
    onSubmit({
      ...data,
      books: kardex ? kardex.books : selectedBooks,
    });
  });

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirmAddBook = () => {
    closeSearchBookModal();
    const selectedOptions = booksOptions?.filter((bO) => bO.checked);

    if (kardex) {
      selectedOptions?.forEach((sO) => {
        const tBook = books?.find((b) => b.title === sO.label);
        const sBook = kardex.books.find((sB) => sB.id === tBook.id);
        if (!sBook) {
          kardex.books.push(tBook as IBook);
        }
      });
    } else {
      selectedOptions?.forEach((sO) => {
        const tBook = books?.find((b) => b.title === sO.label);
        const sBook = selectedBooks.find((sB) => sB.book.id === tBook.id);
        if (!sBook) {
          selectedBooks.push({
            book: tBook,
            quantity: 1,
          } as bookInKardexToBackend);
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

  const dropBookFromList = (book: bookInKardexToBackend) => {
    if (kardex) {
      const index = kardex.books.findIndex((pBook) => pBook.id === book.id);
      kardex.books.splice(index, 1);
    } else {
      setSelectedBooks((prev) =>
        prev.filter((cBook) => cBook.book.id !== book.book.id)
      );
    }

    setBooksOptions((prev) =>
      prev?.map((sO) => {
        if (sO.label === book.book.title) {
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

  const handleQuantityBook = (e, book: bookInKardexToBackend) => {
    const instance = {
      ...book,
      quantity: e.target.value,
    } as bookInKardexToBackend;

    setSelectedBooks((prev) =>
      prev.map((e) => {
        if (e === book) {
          return instance;
        }
        return e;
      })
    );
  };

  return (
    <Container>
      <Title>{title}</Title>

      <StyledEuiForm component="form" onSubmit={handleSubmitForm}>
        <KardexData>
          <EuiFormRow label="Id del docummento">
            <ControlledEuiFieldText
              control={control}
              name="documentId"
              placeholder="Ingrese el id de documento"
            />
          </EuiFormRow>
          <EuiFormRow label="Tipo de documento">
            <ControlledEuiSelect
              control={control}
              name="documentType"
              hasNoInitialSelection
              options={documentsType.map((level) => ({
                value: level,
                text: level,
              }))}
            />
          </EuiFormRow>
          <EuiFormRow label="Tipo de operacion">
            <ControlledEuiSelect
              control={control}
              name="kardexType"
              hasNoInitialSelection
              options={kardexsType.map((level) => ({
                value: level,
                text: level,
              }))}
            />
          </EuiFormRow>
          <EuiFormRow label="Fecha">
            <ControlledEuiDatePicker control={control} name="date" />
          </EuiFormRow>
          <EuiFormRow label="Link del documento">
            <ControlledEuiFieldText
              control={control}
              name="documentImage"
              placeholder="https://www.google.com.pe/"
            />
          </EuiFormRow>
        </KardexData>

        <KardexBooks>
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

          {kardex
            ? kardex.books.map((book, index) => {
                return (
                  <EuiFormRow key={index}>
                    <EuiFormControlLayout
                      isSearchBookModalVisibleappend={[
                        // <EuiFieldNumber
                        //   placeholder="Placeholder text"
                        //   value={value}
                        //   onChange={(e) => onChange(e)}
                        //   aria-label="Use selectedBooksaria labels when no actual label is in use"
                        // />,
                        <EuiButtonIcon
                          onClick={() => dropBookFromList(book)}
                          iconType="trash"
                          aria-label="Next"
                          color="primary"
                        />,
                      ]}
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
                // bookInKardex
                return (
                  <EuiFormRow key={index}>
                    <EuiFormControlLayout
                      append={[
                        <EuiFieldNumber
                          placeholder="Cantidad de libros"
                          value={book.quantity}
                          onChange={(e) => {
                            handleQuantityBook(e, book);
                          }}
                          min="1"
                        />,
                        <EuiButtonIcon
                          onClick={() => dropBookFromList(book)}
                          iconType="trash"
                          aria-label="Next"
                          color="primary"
                        />,
                      ]}
                    >
                      <input
                        type="text"
                        className="euiFieldText"
                        readOnly
                        value={book.book.title}
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
              <EuiButton
                type="submit"
                fill
                disabled={!selectedBooks.length > 0}
              >
                {buttonTitle}
              </EuiButton>
            </ButtonsContainer>
          </EuiFormRow>
        </KardexBooks>
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
