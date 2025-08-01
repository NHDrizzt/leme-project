"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import { useRecentSearches } from "@/hooks/useRecentSearch";
import { InputMask } from "@react-input/mask";
import { searchTypeSchema, getSearchSchema } from "@/schema/searchSchema";
import { z } from "zod";
import styled from "styled-components";
import { Entity, mockEntities } from "@/mocks/data";
import EntityDetailsModal from "@/components/EntityDetailsModal";
import { useSearchContext } from "@/context/SearchContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const formSchema = z.object({
  type: searchTypeSchema,
  value: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const SearchCard = styled(Card)`
  margin-bottom: 2rem;
`;

const RecentSearchesCard = styled(Card)``;

const PredictiveSearchModal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
`;

const PredictiveItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f3f4f6;
  }

  i {
    margin-right: 0.5rem;
    color: #6b7280;
  }
`;

const searchOptions = [
  { label: "CPF/CNPJ", value: "cpf/cnpj" },
  { label: "Email", value: "email" },
  { label: "Telefone", value: "telefone" },
  { label: "Endereço", value: "endereço" },
  { label: "Nome", value: "nome" },
];

export default function Home() {
  const router = useRouter();
  const { recentSearches, addSearch } = useRecentSearches();
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const { setSearchParams } = useSearchContext();
  const [showPredictive, setShowPredictive] = useState(false);
  const [predictiveResults, setPredictiveResults] = useState<Entity[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(inputRef, () => setShowPredictive(false));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "cpf/cnpj",
      value: "",
    },
  });

  const searchType = watch("type");
  const searchValue = watch("value");

  const fetchPredictiveResults = async (query: string) => {
    const { type } = watch();
    const lowerValue = query.toLowerCase().trim();

    return mockEntities.filter((entity) => {
      switch (type) {
        case "cpf/cnpj":
          const cleanedDoc = entity.document.replace(/\D/g, "");
          const cleanedValue = query.replace(/\D/g, "");
          return cleanedDoc.includes(cleanedValue);

        case "email":
          return entity.emails.some((email) =>
            email.address.toLowerCase().includes(lowerValue),
          );

        case "telefone":
          const cleanedPhone = query.replace(/\D/g, "");
          return entity.phones.some((phone) =>
            phone.number.replace(/\D/g, "").includes(cleanedPhone),
          );

        case "endereço":
          return entity.addresses.some(
            (address) =>
              address.street.toLowerCase().includes(lowerValue) ||
              address.neighborhood.toLowerCase().includes(lowerValue) ||
              address.city.toLowerCase().includes(lowerValue),
          );

        case "nome":
          return entity.name.toLowerCase().includes(lowerValue);

        default:
          return false;
      }
    });
  };

  useEffect(() => {
    if (searchValue && searchValue.length > 2) {
      const fetchResults = async () => {
        const results = await fetchPredictiveResults(searchValue);
        setPredictiveResults(results);
        setShowPredictive(true);
      };

      const timer = setTimeout(fetchResults, 300);
      return () => clearTimeout(timer);
    } else {
      setShowPredictive(false);
    }
  }, [searchValue]);

  const getPlaceholder = () => {
    switch (searchType) {
      case "cpf/cnpj":
        return "Digite CPF ou CNPJ";
      case "email":
        return "Digite o email";
      case "telefone":
        return "Digite o telefone";
      case "endereço":
        return "Digite o endereço";
      case "nome":
        return "Digite nome ou razão social";
      default:
        return "";
    }
  };

  useEffect(() => {
    setValue("value", "");
    setShowPredictive(false);
  }, [searchType]);

  const handlePredictiveSelect = (entity: Entity) => {
    setSelectedEntity(entity);
    setValue("value", "");
    addSearch({
      type: "detalhes",
      value: entity.document,
      timestamp: new Date().toISOString(),
      entity: entity,
    });
    setShowPredictive(false);
  };

  const onSubmit = (data: FormValues) => {
    const valueSchema = getSearchSchema(data.type);
    const validationResult = valueSchema.safeParse(data.value);
    if (!validationResult.success) {
      const firstErrorMessage =
        validationResult.error.issues[0].message || "Valor inválido";
      setError("value", {
        type: "manual",
        message: firstErrorMessage,
      });
      return;
    }

    addSearch({
      type: data.type,
      value: data.value,
      timestamp: new Date().toISOString(),
    });

    setSearchParams({
      type: data.type,
      value: data.value,
    });

    router.push(`/results`);
  };

  return (
    <PageContainer>
      <div className={`text-center`}>
        <Title>Consulta de Dados Básicos</Title>
        <Description>
          Encontre as informações essenciais de seus investigados
        </Description>
      </div>

      <SearchCard title="Busca de entidades">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="flex place-items-end justify-content-evenly gap-10 mb-4">
            <div>
              <label htmlFor="type" className="block font-medium mb-2">
                Tipo de busca
              </label>
              <Dropdown
                id="type"
                options={searchOptions}
                value={searchType}
                onChange={(e) => setValue("type", e.value)}
                placeholder="Selecione"
                className="w-[160px]"
                data-cy="search-type"
              />
            </div>
            <div className="relative md:col-span-2" ref={inputRef}>
              <label htmlFor="value" className="block font-medium mb-2">
                {searchOptions.find((opt) => opt.value === searchType)?.label}
              </label>
              {searchType === "cpf/cnpj" && (
                <InputMask
                  key={searchType}
                  mask="___.___.___-__ / ____-__"
                  replacement={{ _: /\d/ }}
                  id="value"
                  placeholder={getPlaceholder()}
                  className={`w-full focus:outline-none border-gray-800/20 min-w-[200px] border-1 rounded-[6px] min-h-[48px] p-2 hover:border-[#E15C3A] focus:border-[#E15C3A] ${errors.value ? "p-invalid" : ""}`}
                  {...register("value")}
                  data-cy="search-input"
                  autoComplete={"off"}
                />
              )}
              {searchType === "telefone" && (
                <InputMask
                  key={searchType}
                  mask="(__) ____-____"
                  replacement={{ _: /\d/ }}
                  id="value"
                  placeholder={getPlaceholder()}
                  className={`w-full focus:outline-none  border-gray-900/10 min-w-[200px] border-1 rounded-[6px] min-h-[48px] p-2 hover:border-[#E15C3A]  focus:border-[#E15C3A] ${errors.value ? "p-invalid" : ""}`}
                  {...register("value")}
                  data-cy="search-input"
                  autoComplete={"off"}
                />
              )}
              {searchType !== "cpf/cnpj" && searchType !== "telefone" && (
                <input
                  id="value"
                  placeholder={getPlaceholder()}
                  className={`w-full focus:outline-none border-gray-900/10 min-w-[200px] border-1 rounded-[6px] min-h-[48px] p-2  hover:border-[#E15C3A] focus:border-[#E15C3A] ${errors.value ? "p-invalid" : ""}`}
                  {...register("value")}
                  data-cy="search-input"
                  autoComplete={"off"}
                />
              )}

              {errors.value && (
                <small
                  className="absolute -bottom-6 whitespace-nowrap left-0 p-error"
                  data-cy={"error-message"}
                >
                  {errors.value.message}
                </small>
              )}

              {showPredictive && predictiveResults.length > 0 && (
                <PredictiveSearchModal>
                  {predictiveResults.map((entity) => (
                    <PredictiveItem
                      key={entity.id}
                      onClick={() => handlePredictiveSelect(entity)}
                    >
                      <i
                        className={
                          entity.type === "individual"
                            ? "pi pi-user"
                            : "pi pi-building"
                        }
                      />
                      <div>
                        <div className="font-medium">{entity.name}</div>
                        <div className="text-sm text-gray-500">
                          {entity.type === "individual"
                            ? `CPF: ${entity.document}`
                            : `CNPJ: ${entity.document}`}
                        </div>
                      </div>
                    </PredictiveItem>
                  ))}
                </PredictiveSearchModal>
              )}
            </div>
            <Button
              label="Pesquisar"
              type="submit"
              icon="pi pi-search"
              className="max-h-[50px] !bg-[#E15C3A] hover:!bg-[#c94b2a] "
              severity={"warning"}
              data-cy="search-button"
            />
          </div>
        </form>
      </SearchCard>

      <RecentSearchesCard
        title="Entidades Visualizadas Recentemente"
        data-cy="recently-viewed-section"
      >
        <DataTable
          value={recentSearches
            .filter((search) => search.entity)
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )}
        >
          <Column header="Nome" body={(row) => row.entity?.name || row.value} />
          <Column
            header="Documento"
            body={(row) => row.entity?.document || row.value}
          />
          <Column
            field="type"
            header="Tipo"
            body={(row) =>
              searchOptions.find((opt) => opt.value === row.type)?.label ||
              (row.entity?.type === "individual" ? "Pessoa" : "Empresa")
            }
          />
          <Column
            field="timestamp"
            header="Visualizado em"
            body={(row) => new Date(row.timestamp).toLocaleString()}
          />
          <Column
            body={(row) => (
              <Button
                label="Ver detalhes"
                icon="pi pi-eye"
                severity={"warning"}
                className="p-button-outlined p-button-sm !border-[#E15C3A] hover:!bg-[#c94b2a] hover:!text-white"
                data-cy="view-details-button"
                onClick={() => {
                  if (row.entity) {
                    setSelectedEntity(row.entity);

                    addSearch({
                      type: row.type,
                      value: row.value,
                      timestamp: new Date().toISOString(),
                    });
                  }
                }}
              />
            )}
          />
        </DataTable>{" "}
      </RecentSearchesCard>

      {selectedEntity && (
        <EntityDetailsModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </PageContainer>
  );
}
