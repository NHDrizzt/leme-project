import { v4 as uuidv4 } from "uuid";

export type EntityType = "individual" | "company";

export type Phone = {
  type: string;
  number: string;
};

export type Email = {
  address: string;
};

export type Address = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

export type Shareholder = {
  name: string;
  document: string;
  share: number;
};

export type Entity = {
  id: string;
  type: EntityType;
  name: string;
  document: string;
  gender?: string;
  birthDate?: string;
  motherName?: string;
  capital?: number;
  startDate?: string;
  situation?: string;
  cnae?: string;
  phones: Phone[];
  emails: Email[];
  addresses: Address[];
  shareholders?: Shareholder[];
};

export const generateMockData = (): Entity[] => {
  const individuals: Entity[] = [
    {
      id: uuidv4(),
      type: "individual",
      name: "João Silva",
      document: "123.456.789-01",
      gender: "Masculino",
      birthDate: "15/05/1980",
      motherName: "Maria Silva",
      phones: [
        { type: "Celular", number: "(11) 98765-4321" },
        { type: "Residencial", number: "(11) 3456-7890" },
      ],
      emails: [
        { address: "joao.silva@gmail.com" },
        { address: "joao.silva@empresa.com.br" },
      ],
      addresses: [
        {
          street: "Rua das Flores",
          number: "100",
          complement: "Apto 101",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zipCode: "01001-000",
        },
      ],
    },
    {
      id: uuidv4(),
      type: "individual",
      name: "João Carlos",
      document: "123.456.789-01",
      gender: "Masculino",
      birthDate: "15/05/1980",
      motherName: "Maria Silva",
      phones: [
        { type: "Celular", number: "(11) 98765-4321" },
        { type: "Residencial", number: "(11) 3456-7890" },
      ],
      emails: [
        { address: "joao.silva@gmail.com" },
        { address: "joao.silva@empresa.com.br" },
      ],
      addresses: [
        {
          street: "Rua das Flores",
          number: "100",
          complement: "Apto 101",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zipCode: "01001-000",
        },
      ],
    },
    {
      id: uuidv4(),
      type: "individual",
      name: "Maria Oliveira",
      document: "987.654.321-09",
      gender: "Feminino",
      birthDate: "22/11/1992",
      motherName: "Ana Oliveira",
      phones: [{ type: "Celular", number: "(21) 99999-8888" }],
      emails: [{ address: "maria.oliveira@hotmail.com" }],
      addresses: [
        {
          street: "Avenida Brasil",
          number: "2000",
          neighborhood: "Copacabana",
          city: "Rio de Janeiro",
          state: "RJ",
          zipCode: "22010-000",
        },
      ],
    },
  ];

  const companies: Entity[] = [
    {
      id: uuidv4(),
      type: "company",
      name: "Empresa ABC Ltda",
      document: "12.345.678/0001-90",
      capital: 1000000,
      startDate: "01/01/2010",
      situation: "Ativa",
      cnae: "62.02-1-00",
      phones: [{ type: "Comercial", number: "(11) 2222-3333" }],
      emails: [{ address: "contato@empresaabc.com.br" }],
      addresses: [
        {
          street: "Avenida Paulista",
          number: "1000",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          zipCode: "01310-100",
        },
      ],
      shareholders: [
        { name: "João Silva", document: "123.456.789-01", share: 60 },
        { name: "Maria Oliveira", document: "987.654.321-09", share: 40 },
      ],
    },
    {
      id: uuidv4(),
      type: "company",
      name: "Comércio XYZ S.A.",
      document: "98.765.432/0001-21",
      capital: 500000,
      startDate: "15/03/2015",
      situation: "Ativa",
      cnae: "47.13-0-01",
      phones: [{ type: "Comercial", number: "(31) 4444-5555" }],
      emails: [{ address: "vendas@comercioxyz.com.br" }],
      addresses: [
        {
          street: "Rua da Bahia",
          number: "1500",
          neighborhood: "Centro",
          city: "Belo Horizonte",
          state: "MG",
          zipCode: "30160-011",
        },
      ],
      shareholders: [
        { name: "Carlos Pereira", document: "456.789.123-45", share: 100 },
      ],
    },
  ];

  return [...individuals, ...companies];
};

export const mockEntities = generateMockData();
