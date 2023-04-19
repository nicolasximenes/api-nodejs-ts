import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - GetAll', ()=> {

  let accessToken = ''
  beforeAll(async () => {
    const email = 'getall_pessoas@gmail.com'
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

  it('Tenta buscar todos os registros sem usar token de autenticação', async () => {
    const testResult = await testServer
      .get('/pessoas')
      .send()
      
    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })

  
  it('Buscar todos os registros', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john_getall@example.com',
        nomeCompleto: 'John Doe'
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resBuscada = await testServer
      .get('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
      
    expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0)
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK)
    expect(resBuscada.body.length).toBeGreaterThan(0)
  })

})