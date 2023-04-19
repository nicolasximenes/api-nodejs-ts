import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - DeleteById', ()=> {

  let accessToken = ''
  beforeAll(async () => {
    const email = 'deletebyid_pessoas@gmail.com'
    await testServer.post('/cadastrar').send({ nome: 'Teste', email, senha: '123456' })
    const signInRes = await testServer.post('/entrar').send({ email, senha: '123456' })
    
    accessToken = signInRes.body.accessToken
  })
  
  let cidadeId: number | undefined = undefined
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Teste' })

    cidadeId = resCidade.body
  })

  it('Tenta apagar um registro sem usar token de autenticação', async () => {
    const testResult = await testServer
      .delete('/pessoas/1')
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  it('Apaga um registro', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john_delete@example.com',
        nomeCompleto: 'John Doe'
      })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resApagada = await testServer
      .delete(`/pessoas/${testResult.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
      
    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta apagar um registro que não existe', async () => {
    const testResult = await testServer
      .delete('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})