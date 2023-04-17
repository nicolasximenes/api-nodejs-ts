import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Usuários - SignUp', ()=> {
  
  it('Cadastra um usuário', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'John Doe',
        email: 'john_doe@example.com',
        senha: '123456',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult.body).toEqual('number')
  })

  it('Cadastra um usuário 2', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'Jane Doe',
        email: 'jane_doe@example.com',
        senha: '123456',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult.body).toEqual('number')
  })

  it('Tenta cadastrar um usuário com email duplicado', async () => {
    const testResult1 = await testServer
      .post('/cadastrar')
      .send({
        nome: 'John Doe',
        email: 'john_duplicado@example.com',
        senha: '123456',
      })

    expect(testResult1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult1.body).toEqual('number')

    const testResult2 = await testServer
      .post('/cadastrar')
      .send({
        nome: 'Jane Doe',
        email: 'john_duplicado@example.com',
        senha: '123456',
      })

    expect(testResult2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult2.body).toHaveProperty('errors.default')
  })

  it('Tenta cadastrar um usuário sem email', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'John Doe',
        senha: '123456',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

  it('Tenta cadastrar um usuário sem nome', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        email: 'john_doe@example.com',
        senha: '123456',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nome')
  })

  it('Tenta cadastrar um usuário sem senha', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'John Doe',
        email: 'john_doe@example.com',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.senha')
  })

  it('Tenta cadastrar um usuário com email inválido', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'John Doe',
        email: 'john_doe example.com',
        senha: '123456',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

  it('Tenta cadastrar um usuário com senha muito curta', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'John Doe',
        email: 'john_doe@example.com',
        senha: '123',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.senha')
  })

  it('Tenta cadastrar um usuário com nome muito curto', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({
        nome: 'Jo',
        email: 'john_doe@example.com',
        senha: '123456',
      })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nome')
  })

  it('Tenta Cadastrar um usuário sem enviar nenhuma propriedade', async () => {
    const testResult = await testServer
      .post('/cadastrar')
      .send({})

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nome')
    expect(testResult.body).toHaveProperty('errors.body.email')
    expect(testResult.body).toHaveProperty('errors.body.senha')
  })

})