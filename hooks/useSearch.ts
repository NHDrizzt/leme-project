import { useQuery } from "@tanstack/react-query";
import { Entity, mockEntities } from "@/mocks/data";

export type SearchType =
  | "cpf/cnpj"
  | "email"
  | "telefone"
  | "endereço"
  | "nome";

interface SearchParams {
  type: SearchType;
  value: string;
}

const searchEntities = async (params: SearchParams): Promise<Entity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { type, value } = params;
  const lowerValue = value.toLowerCase().trim();

  return mockEntities.filter((entity) => {
    switch (type) {
      case "cpf/cnpj":
        const cleanedDoc = entity.document.replace(/\D/g, "");
        const cleanedValue = value.replace(/\D/g, "");
        return cleanedDoc.includes(cleanedValue);

      case "email":
        return entity.emails.some((email) =>
          email.address.toLowerCase().includes(lowerValue),
        );

      case "telefone":
        const cleanedPhone = value.replace(/\D/g, "");
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

export const useSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => searchEntities(params),
    enabled: !!params.value,
    staleTime: 5 * 60 * 1000,
  });
};
