import { IPackage } from "services/packages/definitions";
import { usePacks } from "services/packages/packages.hook";
import { CRUDTable } from "../../../../components/CRUDTable/CRUDTable";

export function PackagesTable() {
  const { paginatedPacks, deletePackMutation } = usePacks();

  const handleDeletePack = async (pack: IPackage) => {
    await deletePackMutation.mutateAsync(String(pack.id));
  };

  const handleDeleteMultiplePacks = async (selectedItems: IPackage[]) => {
    await Promise.all(
      selectedItems.map((pack) =>
        deletePackMutation.mutateAsync(String(pack.id))
      )
    );
  };

  return (
    <CRUDTable<IPackage>
      entityNameSingular="Paquete"
      entityNamePlural="Paquetes"
      initialSortField="level"
      getPaginatedEntities={paginatedPacks}
      onDelete={handleDeletePack}
      onDeleteMultiple={handleDeleteMultiplePacks}
      columns={[
        {
          field: "level",
          name: "Nivel",
          truncateText: true,
          sortable: true,
        },
        {
          field: "school",
          name: "School",
          truncateText: true,
          sortable: true,
        },
        {
          field: "grade",
          name: "Grado",
          truncateText: true,
          sortable: true,
        },
      ]}
    />
  );
}
