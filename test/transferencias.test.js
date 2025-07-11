const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao')
const postTransferencias = require('../fixtures/postTransferencias.json')   


describe ('Transferências', () => {
    let token

        beforeEach (async () => {
            token = await obterToken('julio.lima', '123456')
        })

    describe('POST /transferencias', () => {
        it('Deve retornar 201 (sucesso) quando o valor da transferência for igual ou acima de R$ 10,00', async () => { 
            const bodyTransferencias = { ...postTransferencias } 
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set ('Authorization', `Bearer ${token}`) 
                .send(bodyTransferencias)              

                  // Validações com Chai
                expect(resposta.status).to.equal(201); // Status deve ser 201
                 })

        it('Deve retornar 403 quando o usuário não tiver permissão', async () => { 
            token = await obterToken('junior.lima', '123456')
            const bodyTransferencias = { ...postTransferencias} 
            bodyTransferencias.valor = 7 // Aqui eu altero o que é diferente do postTransferencia

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set ('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho de autorização   
                .send(bodyTransferencias)

                  // Validações com Chai
                expect(resposta.status).to.equal(403);  // Status deve ser 403
            }) 

    
        it('Deve retornar 422 se houver a transferência for abaixo de R$ 10,00', async () => { 
            const bodyTransferencias = { ...postTransferencias} 
            bodyTransferencias.valor = 7
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set ('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho de autorização   
                .send(bodyTransferencias)

                  // Validações com Chai
                expect(resposta.status).to.equal(422); // Status deve ser 422
                 })

describe ('GET /Transferências/{id}', () => {
    it('Deve retornar sucesso 200 e dados iguais ao registro de transferência contido no banco de dados quando o ID for válido', async () => { 
        const resposta = await request(process.env.BASE_URL)
        .get('/transferencias/2')
        .set('Authorization', `Bearer ${token}`) 

        console.log(resposta.status)
        console.log(resposta.body)
        expect(resposta.status).to.equal(200) // Status deve ser 200
        expect(resposta.body.id).to.equal(2) // ID deve ser 2
        expect(resposta.body.id).to.be.a('number') 
        expect(resposta.body.conta_origem_id).to.equal(1) // Valor deve ser 10
        expect(resposta.body.valor).to.equal('20.00') 

    })
})
    describe ('GET /Transferências', () => {
        it('Deve retornar 10 elementos na paginação quando informar limite de 10 registeos', async () => {
            const resposta = await request(process.env.BASE_URL)
            .get('/transferencias?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200) // Status 
            expect(resposta.body.limit).to.equal(10) 
            expect(resposta.body.transferencias).to.have.lengthOf(10)
    })
})

})
})
