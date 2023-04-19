import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - UpdateById', ()=> {

  let accessToken = ''
  beforeAll(async () => {
    const email = 'updatebyid_pessoas@gmail.com'
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

  it('Tenta atualizar um registro sem usar token de autenticação', async () => {
    const testResult = await testServer
      .put('/pessoas/1')
      .send({
        cidadeId,
        email: 'john@example.com',
        nomeCompleto: 'John Doe'
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  it('Atualiza um registro por ID', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john_updatebyid@example.com',
        nomeCompleto: 'John Doe'
      })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resAtualizada = await testServer
      .put(`/pessoas/${testResult.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john_updatebyid_ok@example.com',
        nomeCompleto: 'John Doe'
      })

    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta atualizar um registro que não existe', async () => {
    const testResult = await testServer
      .put('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john@example.com',
        nomeCompleto: 'John Doe'
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})