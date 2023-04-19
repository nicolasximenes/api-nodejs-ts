import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - Create', ()=> {

  let accessToken = ''
  beforeAll(async () => {
    const email = 'create_pessoas@gmail.com'
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

  it('Tenta cria um registro sem token de autenticação', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        nomeCompleto: 'John Doe',
        email: 'john_create@example.com',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })

  it('Cria um registro', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'John Doe',
        email: 'john_create@example.com',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult.body).toEqual('number')
  })

  it('Cria um registro 2', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'John Doe',
        email: 'john_create2@example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult.body).toEqual('number')
  })

  it('Cria um registro duplicado', async () => {
    const testResult1 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'John Doe',
        email: 'john_duplicado@example.com',
      })

    expect(testResult1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult1.body).toEqual('number')

    const testResult2 = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'John Doe Duplicado',
        email: 'john_duplicado@example.com',
      })

    expect(testResult2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult2.body).toHaveProperty('errors.default')
  })

  it('Cria um registro com nomeCompleto muito curto', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'Jo',
        email: 'john@example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nomeCompleto')
  })

  it('Cria um registro sem nomeCompleto', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: 'john@example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nomeCompleto')
  })

  it('Cria um registro sem email', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'John Doe',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

  it('Cria um registro com email inválido', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        nomeCompleto: 'John Doe',
        email: 'john_example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

  it('Cria um registro sem cidadeId', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nomeCompleto: 'John Doe',
        email: 'john@example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.cidadeId')
  })

  it('Cria um registro com cidadeId inválido', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId: 'teste',
        nomeCompleto: 'John Doe',
        email: 'john@example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.cidadeId')
  })

  it('Tenta criar um registro sem enviar nenhuma propriedade', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({})

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nomeCompleto')
    expect(testResult.body).toHaveProperty('errors.body.cidadeId')
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

})