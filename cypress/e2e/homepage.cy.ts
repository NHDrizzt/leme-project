describe("Homepage Search Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the main title", () => {
    cy.contains("h1", "Consulta de Dados Básicos").should("be.visible");
  });

  it("performs search and opens entity details", () => {
    cy.get('[data-cy="search-type"]').click();
    cy.get(".p-dropdown-items").contains("li", "CPF/CNPJ").click();

    cy.get('[data-cy="search-input"]').type("123.456.789-01");

    cy.get('[data-cy="search-button"]').click();

    cy.url().should("include", "/results");
    cy.contains("Resultados da Busca").should("be.visible");

    cy.get('[data-cy="entity-row"]', { timeout: 10000 }).should("be.visible");

    cy.get('[data-cy="view-details-button"]').first().click();

    cy.get('[data-cy="entity-details-modal"]').should("be.visible");
    cy.get('[data-cy="entity-name"]').should("contain", "João Silva");

    cy.get('[data-cy="entity-document"]').should("contain", "123.456.789-01");
  });
});

describe("Entity View Flow", () => {
  const entityName = "João Silva";
  const entityDocument = "123.456.789-01";

  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem("recentSearches", JSON.stringify([]));
    });

    cy.visit("/");
  });

  it("shows viewed entity on homepage", () => {
    cy.primeReactSelect('[data-cy="search-type"]', "CPF/CNPJ");
    cy.get('[data-cy="search-input"]').type(entityDocument);
    cy.get('[data-cy="search-button"]').click();

    cy.get('[data-cy="view-details-button"]')
      .should("be.visible")
      .first()
      .click();

    cy.get('[data-cy="entity-details-modal"]').should("be.visible");
    cy.get('[data-cy="entity-name"]').should("contain", entityName);

    cy.get('[data-cy="close-modal-button"]').click();
    cy.get('[data-cy="entity-details-modal"]').should("not.exist");

    cy.visit("/");

    cy.get('[data-cy="recently-viewed-section"]')
      .should("be.visible")
      .within(() => {
        cy.contains(entityName).should("be.visible");
        cy.contains(entityDocument).should("be.visible");
      });
  });
});

describe("CPF Validation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows error for invalid CPF length", () => {
    // Select CPF/CNPJ search type
    cy.get('[data-cy="search-type"]').click();
    cy.get(".p-dropdown-items").contains("li", "CPF/CNPJ").click();

    // Enter invalid CPF (9 digits)
    cy.get('[data-cy="search-input"]').clear().type("123.456.789"); // 9 digits (invalid)

    // Submit form
    cy.get('[data-cy="search-button"]').click();

    // Verify error message
    cy.get('[data-cy="error-message"]')
      .should("be.visible")
      .and("contain.text", "CPF deve ter 11 dígitos ou CNPJ 14 dígitos");
  });

  it("shows error for incomplete CPF", () => {
    // Select CPF/CNPJ search type
    cy.primeReactSelect('[data-cy="search-type"]', "CPF/CNPJ");

    // Enter incomplete CPF (10 digits)
    cy.get('[data-cy="search-input"]').clear().type("123.456.7890"); // 10 digits (invalid)

    // Submit form
    cy.get('[data-cy="search-button"]').click();

    // Verify error message
    cy.get('[data-cy="error-message"]')
      .should("be.visible")
      .and("have.text", "CPF deve ter 11 dígitos ou CNPJ 14 dígitos");
  });

  it("accepts valid CPF", () => {
    // Select CPF/CNPJ search type
    cy.primeReactSelect('[data-cy="search-type"]', "CPF/CNPJ");

    // Enter valid CPF (11 digits)
    cy.get('[data-cy="search-input"]').clear().type("123.456.789-01"); // 11 digits (valid)

    // Submit form
    cy.get('[data-cy="search-button"]').click();

    // Should navigate to results page
    cy.url().should("include", "/results");
  });

  it("accepts valid CNPJ", () => {
    // Select CPF/CNPJ search type
    cy.primeReactSelect('[data-cy="search-type"]', "CPF/CNPJ");

    // Enter valid CNPJ (14 digits)
    cy.get('[data-cy="search-input"]').clear().type("12.345.678/0001-90"); // 14 digits (valid)

    // Submit form
    cy.get('[data-cy="search-button"]').click();

    // Should navigate to results page
    cy.url().should("include", "/results");
  });
});

describe("Search Validation", () => {
  const testCases = [
    {
      type: "email",
      name: "Email",
      invalidInputs: [
        { value: "", error: "Email é obrigatório" },
        { value: "invalid", error: "Email inválido" },
        { value: "user@", error: "Email inválido" },
        { value: "user@domain", error: "Email inválido" },
      ],
      validInputs: [
        "user@domain.com",
        "john.doe@company.co.uk",
        "test+filter@example.org",
      ],
    },
    {
      type: "telefone",
      name: "Telefone",
      invalidInputs: [
        { value: "", error: "Telefone é obrigatório" },
        { value: "123", error: "Telefone deve ter 10 ou 11 dígitos" },
        { value: "123456789", error: "Telefone deve ter 10 ou 11 dígitos" },
      ],
      validInputs: ["(11) 9123-4567", "11912345678", "(21) 3456-7890"],
    },
    {
      type: "endereço",
      name: "Endereço",
      invalidInputs: [
        { value: "", error: "Endereço é obrigatório" },
        { value: "   ", error: "Endereço é obrigatório" },
      ],
      validInputs: [
        "Rua das Flores, 123",
        "Avenida Paulista, 1000",
        "Praça da Sé",
      ],
    },
    {
      type: "nome",
      name: "Nome",
      invalidInputs: [
        { value: "", error: "Nome deve ter pelo menos 3 caracteres" },
        { value: "ab", error: "Nome deve ter pelo menos 3 caracteres" },
        { value: "a".repeat(101), error: "Nome muito longo" },
      ],
      validInputs: ["João Silva", "Maria", "A".repeat(100)],
    },
  ];

  beforeEach(() => {
    cy.visit("/");
  });

  testCases.forEach(({ type, name, invalidInputs, validInputs }) => {
    describe(`${name} Validation`, () => {
      invalidInputs.forEach(({ value, error }, index) => {
        it(`shows error '${error}' for input '${value}'`, () => {
          cy.primeReactSelect('[data-cy="search-type"]', name);

          const input = cy.get('[data-cy="search-input"]').clear();

          if (index > 0) {
            input.type(value);
          }

          cy.get('[data-cy="search-button"]').click();

          cy.get('[data-cy="error-message"]')
            .should("be.visible")
            .and("contain.text", error);
        });
      });

      validInputs.forEach((value) => {
        it(`accepts valid input '${value}'`, () => {
          cy.primeReactSelect('[data-cy="search-type"]', name);

          cy.get('[data-cy="search-input"]').clear().type(value);

          cy.get('[data-cy="search-button"]').click();

          cy.url().should("include", "/results");
          cy.contains("Resultados da Busca").should("be.visible");
        });
      });
    });
  });
});
