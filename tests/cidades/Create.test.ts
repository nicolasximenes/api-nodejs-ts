import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - Create', ()=> {
  // it() -> test scenario or test case
  
  let accessToken = ''
  beforeAll(async () => {
    const email = 'create_cidades@gmail.com'
    await testServer.post('/cadastrar').send({ nome: 'Teste', email, senha: '123456' })
    const signInRes = await testServer.post('/entrar').send({ email, senha: '123456' })
    
    accessToken = signInRes.body.accessToken
  })

  
  it('Tenta criar um registro sem token de acesso', async () => {
    const testResult = await testServer
      .post('/cidades')
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  it('Cria um registro', async () => {
    const testResult = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult.body).toEqual('number')
  })

  it('Tenta criar um registro com o nome muito curto', async () => {
    const testResult = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Sa' })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nome')
  })

})