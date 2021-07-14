import { useState } from "react";

import { IBookInKardex } from "services/bookInKardex/definitions";
import { CRUDTable } from "../../../../components/CRUDTable/CRUDTable";

import { useBookInKardex } from "services/bookInKardex/bookInKardex";

import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiCard,
} from "@elastic/eui";

export function KardexTable() {
  const { paginatedBookInKardex } = useBookInKardex();

  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [previewSelected, setPreviewSelected] = useState<IBookInKardex>(null);

  const showSearchBookModal = () => setIsPreviewModal(true);
  const closeSearchBookModal = () => setIsPreviewModal(false);

  // delete...
  const handleDeleteKardex = async (kardex: IBookInKardex) => {
    setTimeout(() => {
      console.log(kardex);
    }, 100);
  };

  const handleDeleteMultipleKardex = async (selectedItems: IBookInKardex[]) => {
    setTimeout(() => {
      selectedItems.map((kardex) => console.log(kardex));
    }, 100);
  };

  const handlePreview = (e) => {
    setPreviewSelected(e);
    showSearchBookModal();
  };

  return (
    <div className="">
      <CRUDTable<IBookInKardex>
        entityNameSingular="Kardex"
        entityNamePlural="Kardex"
        initialSortField="id"
        getPaginatedEntities={paginatedBookInKardex}
        onDelete={handleDeleteKardex}
        onDeleteMultiple={handleDeleteMultipleKardex}
        columns={[
          {
            field: "documentId",
            name: "Id Documento",
            truncateText: true,
            sortable: true,
          },
          {
            field: "documentType",
            name: "Tipo de documento",
            truncateText: true,
            sortable: true,
          },
          {
            field: "kardexType",
            name: "Tipo de operacion",
            truncateText: true,
            sortable: true,
          },
          {
            field: "date",
            name: "Fecha",
            truncateText: true,
            sortable: true,
          },
          {
            field: "documentImage",
            name: "URL",
            truncateText: true,
            sortable: true,
          },
          {
            field: "books",
            name: "Cantidad",
            truncateText: true,
            sortable: true,
            render: (books) => {
              return books.reduce((sum, val) => sum + val.quantity, 0);
            },
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
            {previewSelected.books.map((book) => {
              return (
                <EuiCard
                  title={`${book.book.title} `}
                  description={`Cantidad: ${book.quantity}`}
                  paddingSize="s"
                />
              );
            })}
          </EuiModalBody>
        </EuiModal>
      ) : null}
    </div>
  );
}
