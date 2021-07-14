import { useHistory } from "react-router-dom";

import { IBook } from "services/books/definitions";

import { BookForm } from "../BookForm";
import { useBooks } from "../../../../services/books/books.hook";

export function CreateBook() {
  const history = useHistory();
  const { createBookMutation } = useBooks();

  const handleSubmitForm = async (data: IBook) => {
    const newBook = {
      ...data,
      price: String(data.price * 100),
      grade: String(data.grade),
    };

    try {
      await createBookMutation.mutateAsync(newBook);

      history.push(`/books`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push(`/books`);
  };

  return (
    <BookForm
      title="Crear Libro"
      buttonTitle="Crear"
      onSubmit={handleSubmitForm}
      onCancel={handleCancel}
    />
  );
}
