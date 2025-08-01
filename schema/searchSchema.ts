import { z } from "zod";

export const searchTypeSchema = z.enum([
  "cpf/cnpj",
  "email",
  "telefone",
  "endereço",
  "nome",
]);

export type SearchType = z.infer<typeof searchTypeSchema>;

const cpfCnpjSchema = z
  .string()
  .min(1, "CPF/CNPJ é obrigatório")
  .refine(
    (value) => {
      const cleaned = value.replace(/\D/g, "");
      return cleaned.length === 11 || cleaned.length === 14;
    },
    {
      message: "CPF deve ter 11 dígitos ou CNPJ 14 dígitos",
    },
  );

const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email inválido");

const telefoneSchema = z
  .string()
  .min(1, "Telefone é obrigatório")
  .refine(
    (value) => {
      const cleaned = value.replace(/\D/g, "");
      return cleaned.length >= 10 && cleaned.length <= 11;
    },
    {
      message: "Telefone deve ter 10 ou 11 dígitos",
    },
  );

const enderecoSchema = z
  .string()
  .min(1, "Endereço é obrigatório")
  .refine((val) => val.trim().length > 0, {
    message: "Endereço é obrigatório",
  });
const nomeSchema = z
  .string()
  .min(3, "Nome deve ter pelo menos 3 caracteres")
  .max(100, "Nome muito longo");

export const getSearchSchema = (type: SearchType) => {
  switch (type) {
    case "cpf/cnpj":
      return cpfCnpjSchema;
    case "email":
      return emailSchema;
    case "telefone":
      return telefoneSchema;
    case "endereço":
      return enderecoSchema;
    case "nome":
      return nomeSchema;
    default:
      return z.string();
  }
};

const formSchema = z
  .object({
    type: searchTypeSchema,
    value: z.string(),
  })
  .superRefine((data, ctx) => {
    const valueSchema = getSearchSchema(data.type);
    const result = valueSchema.safeParse(data.value);
    if (!result.success) {
      ctx.addIssue({
        path: ["value"],
        code: z.ZodIssueCode.custom,
        message: result.error.issues[0].message,
      });
    }
  });
