import { useHistory } from "react-router-dom";

import { KardexForm } from "../KardexForm";
import {
  useBookInKardex,
  IBookInKardexToBackend,
} from "services/bookInKardex/bookInKardex";

export function CreateKardex() {
  const history = useHistory();
  const { createKardexMutation } = useBookInKardex();

  const handleSubmitForm = async (data: IBookInKardexToBackend) => {
    const newKardex = {
      ...data,
    };

    try {
      await createKardexMutation.mutateAsync(newKardex);
      history.push(`/kardex`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push(`/kardex`);
  };

  return (
    <KardexForm
      title="Ingresar nuevo registro de kardex"
      buttonTitle="Crear"
      onSubmit={handleSubmitForm}
      onCancel={handleCancel}
    />
  );
}
