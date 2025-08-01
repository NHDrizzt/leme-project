import { Dialog } from "primereact/dialog";
import { Entity } from "@/mocks/data";
import styled from "styled-components";
import { Button } from "primereact/button";

const ModalContainer = styled.div`
  .p-dialog-content {
    padding: 0;
  }
`;

const DetailsSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Field = styled.div`
  margin-bottom: 0.75rem;

  label {
    font-weight: 500;
    color: #4b5563;
    display: block;
    margin-bottom: 0.25rem;
  }

  p {
    color: #1f2937;
  }
`;

const EntityDetailsModal = ({
  entity,
  onClose,
}: {
  entity: Entity;
  onClose: () => void;
}) => {
  return (
    <Dialog
      visible={!!entity}
      onHide={onClose}
      header={`Detalhes da entidade: ${entity?.name}`}
      className="w-full max-w-3xl"
      data-cy="entity-details-modal"
      closable={false}
    >
      <div className="absolute top-2 right-2">
        <Button
          icon="pi pi-times"
          className="p-button-text p-button-rounded p-button-sm"
          onClick={onClose}
          data-cy="close-modal-button"
          aria-label="Fechar"
        />
      </div>
      <ModalContainer>
        {entity && (
          <div>
            <DetailsSection>
              <SectionTitle>Informações Básicas</SectionTitle>
              <Field>
                <label>Nome</label>
                <p data-cy="entity-name">{entity.name}</p>
              </Field>
              <Field>
                <label>{entity.type === "individual" ? "CPF" : "CNPJ"}</label>
                <p data-cy="entity-document">{entity.document}</p>
              </Field>

              {entity.type === "individual" && (
                <>
                  <Field>
                    <label>Sexo</label>
                    <p>{entity.gender}</p>
                  </Field>
                  <Field>
                    <label>Data de Nascimento</label>
                    <p>{entity.birthDate}</p>
                  </Field>
                  <Field>
                    <label>Nome da Mãe</label>
                    <p>{entity.motherName}</p>
                  </Field>
                </>
              )}

              {entity.type === "company" && (
                <>
                  <Field>
                    <label>Capital Social</label>
                    <p>
                      {entity.capital?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </Field>
                  <Field>
                    <label>Data de Início das Atividades</label>
                    <p>{entity.startDate}</p>
                  </Field>
                  <Field>
                    <label>Situação Cadastral</label>
                    <p>{entity.situation}</p>
                  </Field>
                  <Field>
                    <label>CNAE principal</label>
                    <p>{entity.cnae}</p>
                  </Field>
                </>
              )}
            </DetailsSection>

            <DetailsSection>
              <SectionTitle>Contatos</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Telefones</h4>
                  {entity.phones.map((phone, index) => (
                    <div key={index} className="mb-1">
                      {phone.type}: {phone.number}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Emails</h4>
                  {entity.emails.map((email, index) => (
                    <div key={index} className="mb-1">
                      {email.address}
                    </div>
                  ))}
                </div>
              </div>
            </DetailsSection>

            <DetailsSection>
              <SectionTitle>Endereços</SectionTitle>
              {entity.addresses.map((address, index) => (
                <div key={index} className="mb-4">
                  <p>
                    {address.street}, {address.number}
                    {address.complement && `, ${address.complement}`}
                  </p>
                  <p>
                    {address.neighborhood}, {address.city} - {address.state}
                  </p>
                  <p>CEP: {address.zipCode}</p>
                </div>
              ))}
            </DetailsSection>

            {entity.type === "company" && entity.shareholders && (
              <DetailsSection>
                <SectionTitle>Quadro Societário</SectionTitle>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Nome</th>
                        <th className="text-left p-2">Documento</th>
                        <th className="text-left p-2">Participação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entity.shareholders.map((shareholder, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{shareholder.name}</td>
                          <td className="p-2">{shareholder.document}</td>
                          <td className="p-2">{shareholder.share}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DetailsSection>
            )}
          </div>
        )}
      </ModalContainer>
    </Dialog>
  );
};

export default EntityDetailsModal;
