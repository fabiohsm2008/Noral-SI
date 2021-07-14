import { EuiLink } from "@elastic/eui";

import { IBook } from "services/books/definitions";
import { useBooks } from "services/books/books.hook";

import { CRUDTable } from "../../../../components/CRUDTable/CRUDTable";

export function BooksTable() {
  const { paginatedBooks, deleteBookMutation } = useBooks();

  const handleDeleteBook = async (book: IBook) => {
    await deleteBookMutation.mutateAsync(String(book.id));
  };

  const handleDeleteMultipleBooks = async (selectedItems: IBook[]) => {
    await Promise.all(
      selectedItems.map((book) =>
        deleteBookMutation.mutateAsync(String(book.id))
      )
    );
  };

  return (
    <CRUDTable<IBook>
      entityNameSingular="libro"
      entityNamePlural="libros"
      initialSortField="title"
      getPaginatedEntities={paginatedBooks}
      onDelete={handleDeleteBook}
      onDeleteMultiple={handleDeleteMultipleBooks}
      columns={[
        {
          field: "title",
          name: "Título",
          truncateText: true,
          sortable: true,
        },
        {
          field: "editorial",
          name: "Editorial",
          truncateText: true,
        },
        {
          field: "price",
          name: "Precio",
          render: (price: number) => `S/ ${price / 100}`,
        },
        {
          field: "stock",
          name: "Stock",
          truncateText: true,
        },
        {
          field: "cover",
          name: "Portada",
          render: (imageUrl: string) => (
            <EuiLink href={imageUrl} target="_blank" />
          ),
        },
      ]}
    />
  );
}
