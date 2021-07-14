import { useHistory } from "react-router-dom";

import { IPackage } from "services/packages/definitions";

import { PackForm } from "../PackForm";
import { usePacks } from "../../../../services/packages/packages.hook";

export function CreatePack() {
  const history = useHistory();
  const { createPackMutation } = usePacks();

  const handleSubmitForm = async (data: IPackage) => {
    const newPack = {
      ...data,
    };
   
    try {
      await createPackMutation.mutateAsync(newPack);
      history.push(`/packages`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push(`/packages`);
  };

  return (
    <PackForm
      title="Crear Paquete"
      buttonTitle="Crear"
      onSubmit={handleSubmitForm}
      onCancel={handleCancel}
    />
  );
}
