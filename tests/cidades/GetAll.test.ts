import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - GetAll', ()=> {
  
  let accessToken = ''
  beforeAll(async () => {
    const email = 'getall_cidades@gmail.com'
    await testServer.post('/cadastrar').send({ nome: 'Teste', email, senha: '123456' })
    const signInRes = await testServer.post('/entrar').send({ email, senha: '123456' })
    
    accessToken = signInRes.body.accessToken
  })

  it('Tenta consultar sem token de autorização', async () => {
    const testResult = await testServer
      .get('/cidades')
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  
  it('Buscar todos os registros', async () => {
    const testResult = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resBuscada = await testServer
      .get('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
    
    expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0)
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK)
    expect(resBuscada.body.length).toBeGreaterThan(0)
  })

})