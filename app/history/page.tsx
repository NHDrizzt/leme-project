"use client";
import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import styled from "styled-components";
import { Card } from "primereact/card";
import { useRecentSearches } from "@/hooks/useRecentSearch";
const searchOptions = [
  { label: "CPF/CNPJ", value: "cpf/cnpj" },
  { label: "Email", value: "email" },
  { label: "Telefone", value: "telefone" },
  { label: "Endereço", value: "endereço" },
  { label: "Nome", value: "nome" },
];
const RecentSearchesCard = styled(Card)``;

const Page = () => {
  const { recentSearches } = useRecentSearches();

  return (
    <div className={"max-w-6xl mx-auto p-4"}>
      <RecentSearchesCard title="Últimas 10 pesquisas realizadas">
        <DataTable value={recentSearches}>
          <Column field="value" header="Termo" />
          <Column
            field="type"
            header="Tipo"
            body={(row) =>
              searchOptions.find((opt) => opt.value === row.type)?.label ||
              row.type
            }
          />
          <Column
            field="timestamp"
            header="Data"
            body={(row) => new Date(row.timestamp).toLocaleString()}
          />
        </DataTable>
      </RecentSearchesCard>
    </div>
  );
};

export default Page;
