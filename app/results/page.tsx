"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Entity, EntityType } from "@/mocks/data";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import styled from "styled-components";
import EntityDetailsModal from "@/components/EntityDetailsModal";
import { useRecentSearches } from "@/hooks/useRecentSearch";
import { useSearchContext } from "@/context/SearchContext";
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 10px;
  min-height: 50px;
  min-width: 180px;
  width: 280px;
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;

  i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #d1d5db;
  }
`;

export default function ResultsPage() {
  const { searchParams } = useSearchContext();
  const { type, value } = searchParams;

  const { addSearch } = useRecentSearches();
  const { data, isLoading, isError } = useSearch({ type, value });
  const [filters, setFilters] = useState({
    types: { value: ["individual", "company"], matchMode: FilterMatchMode.IN },
  });
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const entityTypes = [
    { label: "Pessoas Físicas", value: "individual" },
    { label: "Empresas", value: "company" },
  ];

  const filteredEntities =
    data?.filter((entity) => filters.types.value.includes(entity.type)) || [];

  const getEntityIcon = (type: EntityType) => {
    return type === "individual" ? (
      <i className="pi pi-user mr-2"></i>
    ) : (
      <i className="pi pi-building mr-2"></i>
    );
  };

  const handleViewDetails = (entity: Entity) => {
    setSelectedEntity(entity);
    addSearch({
      type: "detalhes",
      value: entity.document,
      timestamp: new Date().toISOString(),
      entity: entity,
    });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Card>
          <div className="flex justify-content-center py-8">
            <i className="pi pi-spin pi-spinner text-2xl"></i>
            <span className="ml-2">Carregando resultados...</span>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <Card className="bg-red-50 border-red-200">
          <div className="text-red-700">
            <i className="pi pi-exclamation-triangle mr-2"></i>
            <strong>Erro na busca</strong>
            <p className="mt-2">
              Ocorreu um erro ao buscar os dados. Por favor, tente novamente.
            </p>
            <Button
              label="Voltar"
              className="mt-3 p-button-outlined p-button-danger "
              onClick={() => window.history.back()}
            />
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Button
        icon="pi pi-arrow-left"
        className="mb-4 !border-[#E15C3A] !bg-[#E15C3A] hover:!bg-[#c94b2a] hover:!text-white"
        aria-label="Voltar"
        style={{ marginBottom: "1rem" }}
        tooltip="Voltar para a página inicial"
        tooltipOptions={{ position: "top" }}
        aria-haspopup="true"
        onClick={() => window.history.back()}
      >
        <span className={`pl-2`}>Voltar</span>
      </Button>

      <Title>Resultados da Busca</Title>

      <h2 className={`text-lg font-bold mb-4`}>Filtros Selecionados</h2>

      <FiltersContainer>
        <MultiSelect
          value={filters.types.value}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              types: { ...prev.types, value: e.value },
            }))
          }
          options={entityTypes}
          placeholder="Selecione os filtros"
          maxSelectedLabels={3}
          className="w-full"
        />
        <div className={`flex items-center gap-2`}></div>
      </FiltersContainer>

      <Card>
        {filteredEntities.length === 0 ? (
          <EmptyResults>
            <i className="pi pi-search"></i>
            <h3>Nenhum resultado encontrado</h3>
            <p className="mt-2">Sua busca não retornou nenhum resultado.</p>
          </EmptyResults>
        ) : (
          <DataView
            value={filteredEntities}
            layout={"list"}
            paginator
            rows={10}
            itemTemplate={(entity) => (
              <div className="pb-2" data-cy="entity-row">
                <div className="flex rounded-lg flex-column md:flex-row align-items-center p-3 border-1 border-gray-900/10 surface-border border-round">
                  <div className="flex-1 flex flex-column md:flex-row align-items-center">
                    <div className="mr-3 my-auto   text-2xl">
                      {getEntityIcon(entity.type)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="font-bold">{entity.name}</div>
                      <div className="text-sm text-color-secondary">
                        {entity.type === "individual"
                          ? `CPF: ${entity.document}`
                          : `CNPJ: ${entity.document}`}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Button
                      label="Ver detalhes"
                      icon="pi pi-eye"
                      className="p-button-outlined !border-[#E15C3A] hover:!bg-[#c94b2a] hover:!text-white !text-[#E15C3A] "
                      onClick={() => handleViewDetails(entity)}
                      data-cy="view-details-button"
                    />
                  </div>
                </div>
              </div>
            )}
          />
        )}
      </Card>

      {selectedEntity && (
        <EntityDetailsModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </PageContainer>
  );
}
