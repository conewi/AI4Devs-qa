describe('Position Details Page Tests', () => {
  // Use position1 from seed data - Senior Full-Stack Engineer
  const positionId = 1;
  
  beforeEach(() => {
    // Visit the position details page
    cy.visit(`http://localhost:3000/positions/${positionId}`);
    
    // Wait for API calls to complete
    cy.intercept('GET', `**/positions/${positionId}/interviewFlow`).as('getInterviewFlow');
    cy.intercept('GET', `**/positions/${positionId}/candidates`).as('getCandidates');
    cy.wait(['@getInterviewFlow', '@getCandidates']);
  });

  it('1. Verify that the title of position is shown and has text', () => {
    // Check that the position title is displayed
    cy.get('h2.text-center').should('be.visible')
      .should('not.be.empty')
      .and('contain', 'Senior Full-Stack Engineer');
  });

  it('2. Verify that columns are shown accordingly to each interview flow process', () => {
    // Check that we have interview stage columns
    cy.get('.card-header').should('be.visible')
      .should('have.length.at.least', 2) // At least initial screening and technical interview
      .should('contain', 'Initial Screening')
      .should('contain', 'Technical Interview')
      .should('contain', 'Manager Interview');
  });

  it('3. Verify that candidate cards are shown in the correct column of each interview flow process', () => {
    // Check that candidates are shown in their respective columns
    cy.get('.card-body').each(($column, index) => {
      // Get the column title
      const columnTitle = cy.get('.card-header').eq(index).invoke('text');
      
      // Check if this column has candidate cards
      cy.wrap($column).find('.card-title').each(($candidateCard) => {
        // Verify the candidate is shown
        cy.wrap($candidateCard).should('be.visible');
      });
    });
    
    // Verify John Doe is in Technical Interview column (based on seed data)
    cy.contains('.card-header', 'Technical Interview')
      .parents('.card')
      .find('.card-title')
      .should('contain', 'John Doe');
  });

  it('4 & 5. Verify that candidate cards can be dragged and dropped between columns', () => {
    // Find a candidate card to drag (John Doe)
    cy.contains('.card-title', 'John Doe')
      .parents('.card').first()
      .then(($card) => {
        // Get source column
        const $sourceColumn = $card.closest('.card-body');
        
        // Find the target column (Manager Interview)
        cy.contains('.card-header', 'Manager Interview')
          .parents('.card')
          .find('.card-body')
          .then(($targetColumn) => {
            // Get positions for drag and drop
            const sourceRect = $card[0].getBoundingClientRect();
            const targetRect = $targetColumn[0].getBoundingClientRect();
            
            // Perform drag and drop
            cy.wrap($card)
              .trigger('mousedown', { button: 0 })
              .trigger('mousemove', { clientX: sourceRect.x, clientY: sourceRect.y })
              .trigger('mousemove', { clientX: targetRect.x, clientY: targetRect.y })
              .trigger('mouseup', { force: true });
            
            // Verify card is now in target column
            cy.contains('.card-header', 'Manager Interview')
              .parents('.card')
              .find('.card-title')
              .should('contain', 'John Doe');
          });
      });
  });

  it('6. Verify that candidate interview step is updated accordingly when drag and drop is performed', () => {
    // Intercept the PUT request to update candidate
    cy.intercept('PUT', '**/candidates/*').as('updateCandidate');
    
    // Find a candidate card to drag (Jane Smith)
    cy.contains('.card-title', 'Jane Smith')
      .parents('.card').first()
      .then(($card) => {
        // Get the candidate ID
        const candidateId = $card.attr('draggable-id');
        
        // Find the target column (Manager Interview)
        cy.contains('.card-header', 'Manager Interview')
          .parents('.card')
          .find('.card-body')
          .then(($targetColumn) => {
            // Get positions for drag and drop
            const sourceRect = $card[0].getBoundingClientRect();
            const targetRect = $targetColumn[0].getBoundingClientRect();
            
            // Get target step ID
            let targetStepId;
            cy.contains('.card-header', 'Manager Interview')
              .parents('.card')
              .then(($column) => {
                const columnIndex = $column.index();
                // Based on seed data, the manager interview step has ID 3
                targetStepId = 3;  
              });
            
            // Perform drag and drop
            cy.wrap($card)
              .trigger('mousedown', { button: 0 })
              .trigger('mousemove', { clientX: sourceRect.x, clientY: sourceRect.y })
              .trigger('mousemove', { clientX: targetRect.x, clientY: targetRect.y })
              .trigger('mouseup', { force: true });
            
            // Verify the API call was made with correct data
            cy.wait('@updateCandidate').then((interception) => {
              // Check the request payload
              expect(interception.request.body).to.have.property('currentInterviewStep');
              expect(interception.request.body.currentInterviewStep).to.equal(targetStepId);
              
              // Check the response is success
              expect(interception.response.statusCode).to.equal(200);
            });
          });
      });
  });
});
