import { Fragment, ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexItem,
  EuiFormControlLayout,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSelectable,
  EuiSpacer,
  EuiTitle,
} from "@elastic/eui";

import { useBooks } from "services/books/books.hook";
import { usePacks } from "services/packages/packages.hook";

import {
  ButtonsContainer,
  Container,
  StyledBooks,
  StyledBooksPacks,
  StyledEuiForm,
  Title,
} from "./styles";
import {
  ClientType,
  DocumentType,
  IBook,
  ISale,
  IPackage,
  PaymentType,
} from "services/sales/definition";

import { ControlledEuiFieldText } from "components/ControlledComponents/ControlledEuiFieldText";
import { ControlledEuiSelect } from "components/ControlledComponents/ControlledEuiSelect";
import { groupBy, sum } from "lodash";

function SelectedBookRow({
  book,
  index,
  setSelectedBooks,
  dropBookFromList,
  price,
}: {
  book: IBook;
  index: number;
  setSelectedBooks: any;
  dropBookFromList: Function;
  price;
}) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedBooks((prev) => {
      const newSelectedPacks = [...prev];
      newSelectedPacks[index].quantity = quantity;

      return newSelectedPacks;
    });
  }, [quantity, setSelectedBooks, index]);

  return (
    <EuiFormRow key={index}>
      <EuiFormControlLayout
        append={[
          <input
            type="number"
            className="euiFieldNumber"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
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
          aria-label="Use aria labels when no actual label is in use"
          readOnly
          value={book.title}
        />
      </EuiFormControlLayout>
    </EuiFormRow>
  );
}

function SelectedPackageRow({
  pack,
  index,
  setSelectedPackages,
  dropPackFromList,
  price,
}: {
  pack: IPackage;
  index: number;
  setSelectedPackages: any;
  dropPackFromList: Function;
  price: number;
}) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedPackages((prev) => {
      const newSelectedPacks = [...prev];
      newSelectedPacks[index].quantity = quantity;

      return newSelectedPacks;
    });
  }, [quantity, index, setSelectedPackages]);

  return (
    <EuiFormRow key={index}>
      <EuiFormControlLayout
        append={[
          <input
            type="number"
            className="euiFieldNumber"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />,
          <EuiButtonIcon
            onClick={() => dropPackFromList(pack)}
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
          value={pack.school}
        />
      </EuiFormControlLayout>
    </EuiFormRow>
  );
}

const documentTypeValues: DocumentType[] = ["BOLETA", "FACTURA"];
//const paymentTypeValues: PaymentType[] = ["CASH", "CARD"];
const paymentTypeValues: { value: PaymentType; text: string }[] = [
  {
    value: "CASH",
    text: "EFECTIVO",
  },
  {
    value: "CARD",
    text: "TARJETA",
  },
];

const clientTypeValues: { value: ClientType; text: string }[] = [
  {
    value: "CLIENT",
    text: "CLIENTE",
  },
  {
    value: "BUSINESS",
    text: "EMPRESA",
  },
];

console.log(clientTypeValues);

interface IBookOption {
  label: string;
  checked: boolean | undefined;
  disabled: boolean;
}

interface IPackOption {
  label: string;
  checked: boolean | undefined;
  disabled: boolean;
}

type Props = {
  title: ReactNode;
  buttonTitle: ReactNode;
  onSubmit: (data: ISale) => void;
  onCancel: () => void;
};

export function SaleForm({ title, buttonTitle, onSubmit, onCancel }: Props) {
  const { handleSubmit, control } = useForm<ISale>();

  const [isSearchBookModalVisible, setIsSearchBookModal] = useState(false);
  const [isSearchPackModalVisible, setIsSearchPackModal] = useState(false);

  const { books } = useBooks();
  const { packs } = usePacks();

  const [booksOptions, setBooksOptions] = useState<IBookOption[]>([]);
  const [packsOptions, setPackagesOptions] = useState<IPackOption[]>([]);
  const [precioTotal, setPrecioTotal] = useState(1);
  const [clientType, setClientType] = useState(false);
  const [executedSetBookOptions, setExecutedSetBookOptions] = useState(false);
  const [executedSetPackageOptions, setExecutedSetPackageOptions] =
    useState(false);

  useEffect(() => {
    if (books && !executedSetBookOptions) {
      const newBooks = books.map((book) => {
        return {
          label: book.title,
          checked: undefined,
          disabled: false,
        };
      });
      setBooksOptions(newBooks);
      setExecutedSetBookOptions(true);
    } else {
      return;
    }
  }, [books, executedSetBookOptions]);

  useEffect(() => {
    if (packs && !executedSetPackageOptions) {
      const newPacks = packs.map((pack) => {
        return {
          label: pack.school,
          checked: undefined,
          disabled: false,
        };
      });
      setPackagesOptions(newPacks);
      setExecutedSetPackageOptions(true);
    } else {
      return;
    }
  }, [packs, executedSetPackageOptions]);

  const [selectedBooks, setSelectedBooks] = useState<IBook[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<IPackage[]>([]);

  useEffect(() => {
    const priceBook = sum(selectedBooks.map((book) => book.price));
    const pricePack = sum(
      selectedPackages.map((pack) => sum(pack.books.map((book) => book.price)))
    );
    const quantityPack = sum(selectedPackages.map((pack) => pack.quantity));
    const quantityBook = sum(selectedBooks.map((book) => book.quantity));
    const TotalBooksPacks =
      (priceBook * quantityBook) / 100 + (pricePack * quantityPack) / 100;

    setPrecioTotal(TotalBooksPacks);
  }, [selectedBooks, selectedPackages]);

  const showSearchBookModal = () => setIsSearchBookModal(true);
  const closeSearchBookModal = () => setIsSearchBookModal(false);
  const showSearchPackModal = () => setIsSearchPackModal(true);
  const closeSearchPackModal = () => setIsSearchPackModal(false);

  const handleSubmitForm = handleSubmit((data) => {
    const books = selectedBooks.map((book) => ({
      title: book.title,
      id: book.id,
      quantity: book.quantity,
    }));
    const packs = selectedPackages.map((pack) =>
      pack.books.map((book) => ({
        title: pack.level,
        id: book.id,
        quantity: pack.quantity,
      }))
    );
    const booksPacks = packs.concat(books);
    const packBooks = Object.values(groupBy(booksPacks.flat(), "id")).map(
      (item) => ({
        id: item[0].id,
        title: item[0].title,
        quantity: sum(item.map((item) => item.quantity)),
      })
    );

    onSubmit({
      ...data,
      clientType: data.clientType,
      books: packBooks,
    });
  });

  // todo: when cancel button is clicked, then redirect to list sales page
  const handleCancel = () => {
    onCancel();
  };

  const handleConfirmAddBook = () => {
    closeSearchBookModal();
    const selectedOptions = booksOptions.filter((book) => book.checked);

    selectedOptions.forEach((selectedOption) => {
      const book = books.find((book) => book.title === selectedOption.label);
      const existsBook = selectedBooks.find(
        (selectedBook) => selectedBook.id === book.id
      );
      if (existsBook) {
        return;
      }

      setSelectedBooks((prev) => [...prev, { ...book, quantity: 1 }]);
    });

    setBooksOptions((prev) =>
      prev.map((bookOption) => ({
        ...bookOption,
        disabled: bookOption.checked,
      }))
    );
  };

  const handleConfirmAddPack = () => {
    closeSearchPackModal();

    const selectedOptions = packsOptions.filter((pack) => pack.checked);

    selectedOptions.forEach((selectedOption) => {
      const pack = packs.find((p) => p.school === selectedOption.label);
      const existsPack = selectedPackages.find(
        (selectedPack) => selectedPack.id === pack.id
      );
      if (existsPack) {
        return;
      }

      setSelectedPackages((prev) => [...prev, { ...pack, quantity: 1 }]);
    });

    setPackagesOptions((prev) =>
      prev.map((packOption) => ({
        ...packOption,
        disabled: packOption.checked,
      }))
    );
  };

  const dropBookFromList = (bookToDelete: IBook) => {
    setSelectedBooks((prev) =>
      prev.filter((item) => item.id !== bookToDelete.id)
    );

    setBooksOptions((prev) => {
      return prev.map((bookOption) =>
        bookOption.label === bookToDelete.title
          ? {
              ...bookOption,
              disabled: false,
              checked: undefined,
            }
          : bookOption
      );
    });
  };

  const dropPackFromList = (PackToDelete: IPackage) => {
    setSelectedPackages((prev) =>
      prev.filter((item) => item.id !== PackToDelete.id)
    );

    setPackagesOptions((prev) => {
      return prev.map((packOption) =>
        packOption.label === PackToDelete.school
          ? {
              ...packOption,
              disabled: false,
              checked: undefined,
            }
          : packOption
      );
    });
  };

  const validateClienType = (e) => {
    console.log(e);
    if (e === "CLIENT") {
      setClientType(true);
    } else {
      setClientType(false);
    }
  };

  return (
    <Container component="form" onSubmit={handleSubmitForm}>
      <Title>{title}</Title>
      <StyledEuiForm>
        <EuiFormRow label="ID del Documento">
          <ControlledEuiFieldText
            control={control}
            name="documentId"
            placeholder="Ingrese Id del Documento"
          />
        </EuiFormRow>
        <EuiFormRow label="Tipo de Comprobante">
          <ControlledEuiSelect
            control={control}
            name="documentType"
            options={documentTypeValues.map((comprobante) => ({
              value: comprobante,
              text: comprobante,
            }))}
          />
        </EuiFormRow>
        <EuiFormRow label="Colegio">
          <ControlledEuiFieldText
            control={control}
            name="school"
            placeholder="Ingrese Colegio"
          />
        </EuiFormRow>
        <EuiFormRow label="Cliente">
          <ControlledEuiFieldText
            control={control}
            name="name"
            placeholder="Ingrese nombre del Cliente"
          />
        </EuiFormRow>
        <EuiFormRow label="Metodo de Pago">
          <ControlledEuiSelect
            control={control}
            name="paymentType"
            options={paymentTypeValues.map((pago) => ({
              value: pago.value,
              text: pago.text,
            }))}
          />
        </EuiFormRow>
        <EuiFormRow label="Tipo Cliente">
          <ControlledEuiSelect
            control={control}
            name="clientType"
            onChange={(value) => validateClienType(value)}
            options={clientTypeValues.map((entidades) => ({
              value: entidades.value,
              text: entidades.text,
            }))}
          />
        </EuiFormRow>
        {clientType ? (
          <EuiFormRow label="Numero del Documento">
            <ControlledEuiFieldText
              control={control}
              name="DNI"
              placeholder="Ingrese Dni"
            />
          </EuiFormRow>
        ) : (
          <EuiFormRow label="RUC">
            <ControlledEuiFieldText
              control={control}
              name="RUC"
              type="number"
              placeholder="Ingrese RUC"
            />
          </EuiFormRow>
        )}

        <EuiFormRow label="Email">
          <ControlledEuiFieldText
            control={control}
            name="email"
            type="email"
            placeholder="Ingrese Email"
          />
        </EuiFormRow>
      </StyledEuiForm>

      <StyledBooksPacks>
        <StyledBooks>
          <EuiTitle size="xs">
            <h1>Libros</h1>
          </EuiTitle>
          {selectedBooks.map((book, index) => {
            return (
              <SelectedBookRow
                price={book.price * book.quantity}
                book={book}
                index={index}
                dropBookFromList={dropBookFromList}
                setSelectedBooks={setSelectedBooks}
              />
            );
          })}
          <EuiSpacer size="xs" />
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
                  options={booksOptions as never[]}
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
              value="Agregar"
            />
          </EuiFormControlLayout>
        </StyledBooks>

        <StyledBooks>
          <EuiTitle size="xs">
            <h1>Paquetes</h1>
          </EuiTitle>
          {selectedPackages.map((pack, index) => {
            return (
              <SelectedPackageRow
                price={pack.quantity}
                pack={pack}
                index={index}
                dropPackFromList={dropPackFromList}
                setSelectedPackages={setSelectedPackages}
              />
            );
          })}
          <EuiSpacer size="xs" />
          {isSearchPackModalVisible ? (
            <EuiModal onClose={closeSearchPackModal}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  <h1>Agregar Paquete</h1>
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <EuiSelectable
                  aria-label="Search book"
                  searchable
                  searchProps={{
                    "data-test-subj": "selectableSearchHere",
                  }}
                  onChange={(newOptions) => setPackagesOptions(newOptions)}
                  options={packsOptions as never[]}
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
                <EuiButtonEmpty onClick={closeSearchPackModal}>
                  Cancel
                </EuiButtonEmpty>
                <EuiButton type="button" fill onClick={handleConfirmAddPack}>
                  Save
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          ) : null}

          <EuiFormControlLayout
            append={
              <EuiButtonIcon
                onClick={showSearchPackModal}
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
              value="Agregar"
            />
          </EuiFormControlLayout>
        </StyledBooks>
      </StyledBooksPacks>

      <EuiSpacer size="m" />
      <EuiFlexItem component="b">PRECIO TOTAL: {precioTotal}</EuiFlexItem>

      <EuiFormRow>
        <ButtonsContainer>
          <EuiButton onClick={handleCancel}>Cancelar</EuiButton>
          <EuiButton type="submit" fill disabled={selectedPackages.length < 1}>
            {buttonTitle}
          </EuiButton>
        </ButtonsContainer>
      </EuiFormRow>
    </Container>
  );
}
