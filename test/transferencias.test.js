const request = require('supertest');
const { expect } = require('chai');

describe ('Transferências', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar 201 (sucesso) quando o valor da transferência for igual ou acima de R$ 10,00', async () => { 
            //Capturar o token 
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                     'username': 'julio.lima',
                     'senha': '123456'
                })

                const token = respostaLogin.body.token; // Captura o token da resposta

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set ('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho de autorização   
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 11,
                    token: ""   //Não preciso enviar o token pois apenas transferências acima de R$5.000,00 requerem um token
                  })

                  // Validações com Chai
                expect(resposta.status).to.equal(201); // Status deve ser 201
                 })

        it('Deve retornar 403 quando o usuário não tiver permissão', async () => { 
            //Capturar o token 
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                     'username': 'junior.lima',
                     'senha': '123456'
                })

                const token = respostaLogin.body.token; // Captura o token da resposta

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set ('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho de autorização   
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 11,
                    token: ""  
                  })

                  // Validações com Chai
                expect(resposta.status).to.equal(403);  // Status deve ser 403
            }) 

    
        it('Deve retornar 422 se houver a transferência for abaixo de R$ 10,00', async () => { 
            //Capturar o token 
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                     'username': 'julio.lima',
                     'senha': '123456'
                })

                const token = respostaLogin.body.token; // Captura o token da resposta

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set ('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho de autorização   
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 7,
                    token: ""   //Não preciso enviar o token pois apenas transferências acima de R$5.000,00 requerem um token
                  })

                  // Validações com Chai
                expect(resposta.status).to.equal(422); // Status deve ser 422
                 })
    })
})