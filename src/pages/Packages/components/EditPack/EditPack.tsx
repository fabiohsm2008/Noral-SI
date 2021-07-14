import { EuiLoadingSpinner } from "@elastic/eui";
import { IPackage } from "services/packages/definitions";
import { useHistory, useParams } from "react-router-dom";

import { PackForm } from "../PackForm";

import { usePacks } from "../../../../services/packages/packages.hook";

export function EditPack() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const { pack, editPackMutation, addBook, removeAllBooks } = usePacks({ id });

  const handleSubmitForm = async (data: IPackage) => {
    const editedPack = {
      ...data,
    };

    try {
      await editPackMutation.mutateAsync(editedPack);
      await removeAllBooks.mutateAsync(data.id);
      data.books.forEach(async (b) => {
        try {
          await addBook.mutateAsync({ idPack: data.id, idBook: b.id });
        } catch (error) {
          console.log(`Add Book: ${error}`);
        }
      });
      history.push(`/packages`);
    } catch (error) {
      console.log(`EditPack: ${error}`);
    }
  };

  const handleCancel = () => {
    history.push(`/packages`);
  };

  return (
    <>
      {pack ? (
        <PackForm
          title="Editar Paquete"
          buttonTitle="Edit"
          onSubmit={handleSubmitForm}
          onCancel={handleCancel}
          pack={pack}
        />
      ) : (
        <EuiLoadingSpinner size="l" />
      )}
    </>
  );
}
