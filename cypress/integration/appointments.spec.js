describe("It should book an interview", () => {
  // beforeEach(() => {
  //   cy.request("GET", "/api/debug/reset");
  //   // cy.visit("/");
  //   // cy.contains("Monday");
  // });
  it("Booking an interview", () => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
    cy.get("[alt=Add]")
      .first()
      .click();
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });
  it("Should edit the test", () => {
    cy.get("[alt=Edit]")
      .eq(1)
      .click({ force: true });
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains("Save").click();
    cy.get(".appointment")
      .eq(1)
      .contains("Lydia Miller-Jones");
    cy.get(".appointment")
      .eq(1)
      .contains("Tori Malcolm");
  });
  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").first().click({ force: true });
    cy.contains("Confirm").click();
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
