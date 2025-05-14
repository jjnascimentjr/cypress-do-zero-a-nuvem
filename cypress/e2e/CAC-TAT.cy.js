describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o titulo da aplicação', () => {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = Cypress._.repeat('aaaaaaaaaaaaaaaaaaaaaah', 2)

    cy.clock()
    cy.get('#firstName')
      .type('Junior')
    cy.get('#lastName')
      .type('Nascimento')
    cy.get('#email')
      .type('jn@gmail.com')
    cy.get('#phone')
      .type('9925578948')
    cy.get('#open-text-area')
      .type(longText, { delay: 10 })
    cy.contains('button', 'Enviar')
      .click()

    cy.get('.success')
      .should('be.visible')

    cy.tick(3000)
    cy.get('.success')
      .should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {

    cy.clock()
    cy.get('#firstName')
      .type('Junior')
    cy.get('#lastName')
      .type('Nascimento')
    cy.get('#email')
      .type('jn2gmail.com')
    cy.get('#phone')
      .type('9925578948')
    cy.get('#open-text-area')
      .type('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida')
    cy.contains('button', 'Enviar')
      .click()

    cy.get('.error')
      .should('be.visible')

    cy.tick(3000)
    cy.get('.error')
      .should('not.be.visible')
  })

  it('se um valor não-numérico for digitado no campo telefone, seu valor continuará vazio', () => {
    cy.get('#phone')
      .type('aaaadd')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {

    cy.clock()
    cy.get('#firstName')
      .type('Junior')
    cy.get('#lastName')
      .type('Nascimento')
    cy.get('#email')
      .type('jn@gmail.com')
    cy.get('#open-text-area')
      .type('testando')
    cy.get('#phone-checkbox')
      .check()
    cy.contains('button', 'Enviar')
      .click()
    cy.get('.error')
      .should('be.visible')

    cy.tick(3000)
    cy.get('.error')
      .should('not.be.visible')
  })


  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Junior')
      .should('have.value', 'Junior')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Nascimento')
      .should('have.value', 'Nascimento')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('jn@gmail.com')
      .should('have.value', 'jn@gmail.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('9925578948')
      .should('have.value', '9925578948')
      .clear()
      .should('have.value', '')
  })


  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.contains('button', 'Enviar')
      .click()

    cy.get('.error')
      .should('be.visible')

    cy.tick(3000)
    cy.get('.error')
      .should('not.be.visible')
  })



  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock()
    const data = {
      firstName: 'Ana',
      lastName: 'Borges',
      email: 'ana@borges.com',
      text: 'customizados.'
    }

    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success')
      .should('be.visible')

    cy.tick(3000) // Avança o relógio em 3s e verifica que a mensagem não está mais visivel
    cy.get('.success')
      .should('not.be.visible') // Valida que a mensagem desapareceu em 3s
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"')
      .each((typeOfservice) => {
        cy.wrap(typeOfservice)
          .check()
          .should('be.checked')
      })
  })
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'CAC TAT - Política de Privacidade')
      .should('be.visible')
  })

  it('exibe mensagem por 3 segundos', () => {
    cy.clock()
    cy.get('#firstName')
      .type('Junior')
    cy.get('#lastName')
      .type('Nascimento')
    cy.get('#email')
      .type('jn@gmail.com')
    cy.get('#open-text-area')
      .type('clock e tick')
    cy.contains('button', 'Enviar')
      .click()
    cy.get('.success')
      .should('be.visible')

    cy.tick(3000)
    cy.get('.success')
      .should('not.be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  it('preenche o campo da área de texto usando o comando invoke', () => {
    cy.get('#open-text-area')
      .invoke('val', 'digitando com o comando invoke')
      .should('have.value', 'digitando com o comando invoke')
  })

  it('faz uma requisição HTTP', () => {
    cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html').as('getRequest')
      .its('status')
      .should('be.equal', 200)
    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
    cy.get('@getRequest')
      .its('body')
      .should('include', 'CAC TAT')
  })

  it('Desafio final, "Encontre o gato"!!', () => {
    cy.get('#cat').invoke('show')
      .should('be.visible')
    cy.get('#title')
      .invoke('text', 'CAT TAT')
  })
})
