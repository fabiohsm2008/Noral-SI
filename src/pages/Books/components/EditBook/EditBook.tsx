import { EuiLoadingSpinner } from "@elastic/eui";
import { IBook } from "services/books/definitions";
import { useHistory, useParams } from "react-router-dom";

import { BookForm } from "../BookForm";

import { useBooks } from "services/books/books.hook";

export function EditBook() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  
  const { book, editBookMutation } = useBooks({ id });

  const handleSubmitForm = async (data: IBook) => {
    const editedBook = {
      ...data,
      id,
      price: String(data.price * 100),
      grade: String(data.grade),
    };

    try {
      await editBookMutation.mutateAsync(editedBook);
      history.push(`/books`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push(`/books`);
  };

  return (
    <>
      {book ? (
        <BookForm
          title="Editar Libro"
          buttonTitle="Editar"
          book={book}
          onSubmit={handleSubmitForm}
          onCancel={handleCancel}
        />
      ) : (
        <EuiLoadingSpinner size="l" />
      )}
    </>
  );
}
