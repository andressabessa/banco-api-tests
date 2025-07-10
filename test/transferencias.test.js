const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao')
const postTransferencias = require('../fixtures/postTransferencias.json')   


describe ('Transferências', () => {
    describe('POST /transferencias', () => {
        let token

        beforeEach (async () => {
            token = await obterToken('julio.lima', '123456')
        })
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
    })
})