import React, { useState } from "react";

import { useHistory, useRouteMatch } from "react-router-dom";

import {
  EuiBasicTable,
  EuiButton,
  EuiConfirmModal,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from "@elastic/eui";

import { Direction } from "@elastic/eui/src/services/sort/sort_direction";
import { capitalize } from "lodash";
import { Switch } from "./styles";

type EntityConstrains = {
  id: number;
};

type Props<IEntity> = {
  entityNameSingular: string;
  entityNamePlural: string;
  initialSortField: keyof IEntity;
  onDelete: (entity: IEntity) => Promise<void>;
  onDeleteMultiple: (entities: IEntity[]) => Promise<void>;
  customCreateUrl?: string;
  getPaginatedEntities: ({
    active: boolean,
  }) => (
    pageIndex: number,
    pageSize: number,
    sortField: keyof IEntity,
    sortDirection: Direction
  ) => { pageOfItems: IEntity[]; totalItemCount: number };
  columns: React.ComponentProps<new () => EuiBasicTable<IEntity>>["columns"];
};

export function CRUDTable<IEntity extends EntityConstrains>({
  entityNameSingular,
  entityNamePlural,
  initialSortField,
  onDelete,
  onDeleteMultiple,
  customCreateUrl,
  getPaginatedEntities,
  columns,
}: Props<IEntity>) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState<Direction>("asc");
  const [selectedItems, setSelectedItems] = useState<IEntity[]>([]);

  const [isSureToDeleteCallback, setIsSureToDeleteCallback] = useState<
    (isSureToDelete: boolean) => void
  >(() => {});

  const history = useHistory();
  const { url } = useRouteMatch();

  const handleCreate = () => {
    history.push(!customCreateUrl ? url + "/create" : customCreateUrl);
  };

  const isSureToDelete = () => {
    showDestroyModal();

    return new Promise((resolve) => {
      setIsSureToDeleteCallback(() => (isSureToDelete: boolean) => {
        closeDestroyModal();

        resolve(isSureToDelete);
      });
    });
  };

  const handleDelete = async (entity: IEntity) => {
    setIsDestroyingMultipleEntities(false);

    const isSure = await isSureToDelete();
    if (!isSure) return;

    await onDelete(entity);

    setSelectedItems([]);
  };

  const handleDeleteMultipleEntities = async () => {
    setIsDestroyingMultipleEntities(true);

    const isSure = await isSureToDelete();
    if (!isSure) return;

    await onDeleteMultiple(selectedItems);

    setSelectedItems([]);
  };

  const onSelectionChange = (selectedItems: IEntity[]) => {
    setSelectedItems(selectedItems);
  };

  const handleEdit = (entity: IEntity) => {
    history.push(`${url}/edit/${entity.id}`);
  };

  const [showInactives, setShowInactives] = useState(false);

  const { pageOfItems, totalItemCount } = getPaginatedEntities({
    active: !showInactives,
  })(pageIndex, pageSize, sortField, sortDirection);

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [10, 20, 30],
  };

  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);
  const [isDestroyingMultipleEntities, setIsDestroyingMultipleEntities] =
    useState(false);

  const handleConfirm = () => {
    isSureToDeleteCallback(true);
  };

  const handleCancel = () => {
    isSureToDeleteCallback(false);
  };

  const showDestroyModal = () => setIsDestroyModalVisible(true);
  const closeDestroyModal = () => setIsDestroyModalVisible(false);

  return (
    <>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiButton color="primary" iconType="plus" onClick={handleCreate}>
            Crear {capitalize(entityNamePlural)}
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem />

        {selectedItems.length > 0 ? (
          <EuiFlexItem grow={false}>
            <EuiButton
              color="danger"
              iconType="trash"
              onClick={handleDeleteMultipleEntities}
            >
              Eliminar {selectedItems.length} {entityNamePlural.toLowerCase()}
            </EuiButton>
          </EuiFlexItem>
        ) : null}
      </EuiFlexGroup>

      <EuiSpacer size="l" />

      <EuiBasicTable<IEntity>
        items={pageOfItems}
        itemId="id"
        columns={[
          ...columns,
          {
            name: "Actions",
            actions: [
              {
                name: "Delete",
                description: `Eliminar este ${entityNameSingular.toLowerCase()}`,
                icon: "trash",
                color: "danger",
                type: "icon",
                onClick: handleDelete,
                isPrimary: true,
                "data-test-subj": "action-delete",
              },
              {
                name: "Edit",
                isPrimary: true,
                description: `Editar este ${entityNameSingular.toLowerCase()}`,
                icon: "pencil",
                type: "icon",
                onClick: handleEdit,
                "data-test-subj": "action-edit",
              },
            ],
          },
        ]}
        pagination={pagination}
        sorting={{
          sort: {
            field: sortField,
            direction: sortDirection,
          },
        }}
        selection={{
          onSelectionChange,
        }}
        hasActions
        onChange={({ page, sort }) => {
          if (page) {
            const { index: pageIndex, size: pageSize } = page;

            setPageIndex(pageIndex);
            setPageSize(pageSize);
          }

          if (sort) {
            const { field: sortField, direction: sortDirection } = sort;

            setSortField(sortField);
            setSortDirection(sortDirection);
          }
        }}
      />

      {isDestroyModalVisible ? (
        <EuiConfirmModal
          title={
            isDestroyingMultipleEntities
              ? `Esta seguro de eliminar estos ${entityNamePlural.toLowerCase()}?`
              : `Esta seguro de eliminar este ${entityNameSingular.toLowerCase()}?`
          }
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          cancelButtonText="Cancelar"
          confirmButtonText="Eliminar"
          buttonColor="danger"
        />
      ) : null}

      <EuiSpacer size="m" />

      <Switch
        label="¿Mostrar inactivos?"
        checked={showInactives}
        onChange={() => setShowInactives((prev) => !prev)}
      />
    </>
  );
}
