import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - GetById', ()=> {

  let accessToken = ''
  beforeAll(async () => {
    const email = 'getbyid_pessoas@gmail.com'
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

  it('Tenta buscar um registro sem usar token de autenticação', async () => {
    const testResult = await testServer
      .get('/pessoas/1')
      .send()
      
    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  
  it('Busca um registro por ID', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john_getbyid@example.com',
        nomeCompleto: 'John Doe'
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resBuscada = await testServer
      .get(`/pessoas/${testResult.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
      
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK)
    expect(resBuscada.body).toHaveProperty('nomeCompleto')
  })

  it('Tenta buscar um registro que não existe', async () => {
    const testResult = await testServer
      .get('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
      
    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})