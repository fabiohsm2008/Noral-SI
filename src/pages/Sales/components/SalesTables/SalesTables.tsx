import { ISale } from "services/sales/definition";
import { useSales } from "services/sales/sale.hooks";
import { CRUDTable } from "components/CRUDTable/CRUDTable";
import { useState } from "react";
import {
  EuiCard,
  EuiModal,
  EuiModalBody,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from "@elastic/eui";
import { useBooksToSale } from "../../../../services/bookToSale/books.hook";
import { IBookToSale } from "../../../../services/bookToSale/definitions";

export function SalesTable() {
  const { paginatedSales, deleteSaleMutation } = useSales();
  const { booksToSales } = useBooksToSale();

  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [previewSelected, setPreviewSelected] = useState<IBookToSale[]>([]);

  const showSearchBookModal = () => setIsPreviewModal(true);
  const closeSearchBookModal = () => setIsPreviewModal(false);

  const handleDeleteSale = async (sale: ISale) => {
    await deleteSaleMutation.mutateAsync(String(sale.id));
  };

  const handleDeleteMultipleSales = async (selectedItems: ISale[]) => {
    await Promise.all(
      selectedItems.map(async (sale) => {
        await deleteSaleMutation.mutateAsync(String(sale.id));
      })
    );
  };

  const handlePreview = (sale: ISale) => {
    const bookToSalesById = booksToSales.filter(
      (bookToSale) => bookToSale.sale.id === sale.id
    );
    setPreviewSelected(bookToSalesById);
    showSearchBookModal();
  };

  return (
    <div>
      <CRUDTable<ISale>
        entityNameSingular="Venta"
        entityNamePlural="Ventas"
        initialSortField="documentId"
        customCreateUrl="emitSale"
        getPaginatedEntities={paginatedSales}
        onDelete={handleDeleteSale}
        onDeleteMultiple={handleDeleteMultipleSales}
        columns={[
          {
            field: "id",
            name: "Id del Documento",
            truncateText: true,
            sortable: true,
          },
          {
            field: "documentType",
            name: "Comprobante",
            truncateText: true,
            sortable: true,
          },
          {
            field: "paymentType",
            name: "Metodo de Pago",
            truncateText: true,
            sortable: true,
          },
          {
            field: "school",
            name: "Colegio",
            truncateText: true,
            sortable: true,
          },
          {
            field: "customer.name",
            name: "Nombre",
            truncateText: true,
            sortable: true,
          },
          {
            field: "documentId",
            name: "Numero del documento",
            truncateText: true,
            sortable: true,
          },
          {
            field: "customer.email",
            name: "Email",
            truncateText: true,
            sortable: true,
          },
          {
            field: "amount",
            name: "Monto",
            truncateText: true,
            sortable: true,
          },
          {
            name: "Preview",
            actions: [
              {
                name: "Delete",
                description: `Ver libros`,
                icon: "inspect",
                color: "danger",
                type: "icon",
                onClick: handlePreview,
                isPrimary: true,
                "data-test-subj": "action-delete",
              },
            ],
          },
        ]}
      />

      {isPreviewModal ? (
        <EuiModal onClose={closeSearchBookModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <h5> Listado de libros </h5>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            {previewSelected.map((bookToSale) => (
              <EuiCard
                title={`${bookToSale.book.title} `}
                description={`Cantidad: ${bookToSale.quantity}`}
                paddingSize="s"
              />
            ))}
          </EuiModalBody>
        </EuiModal>
      ) : null}
    </div>
  );
}
