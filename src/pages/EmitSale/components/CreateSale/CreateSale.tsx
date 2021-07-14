import { useHistory } from "react-router-dom";
import { ISale } from "services/sales/definition";

import { SaleForm } from "../../../Sales/components/SaleForm";
import { useSales } from "services/sales/sale.hooks";

export function CreateSale() {
  const history = useHistory();
  const { createSaleMutation } = useSales();

  const handleSubmitForm = async (sale: ISale) => {
    const newPack = {
      ...sale,
    };
    console.log(newPack);
    try {
      await createSaleMutation.mutateAsync(newPack);

      history.push(`/sales`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push(`/sales`);
  };

  return (
    <SaleForm
      title="Crear Venta"
      buttonTitle="Emitir Venta"
      onSubmit={handleSubmitForm}
      onCancel={handleCancel}
    />
  );
}
