import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Usuários - SignIn', ()=> {
  beforeAll(async () => {
    await testServer.post('/cadastrar').send({
      nome: 'John Doe',
      email: 'john_doe@example.com',
      senha: '123456',
    })
  })
  
  it('Faz login', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        email: 'john_doe@example.com',
        senha: '123456',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.OK)
    expect(testResult.body).toHaveProperty('accessToken')
  })
  
  it('Tenta fazer login com senha errada', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        email: 'john_doe@example.com',
        senha: '1234567',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })

  it('Tenta fazer login com email errado', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        email: 'john_err@example.com',
        senha: '123456',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })

  it('Tenta fazer login com email inválido', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        email: 'john_doe example.com',
        senha: '123456',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

  it('Tenta fazer login com senha muito curta', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        email: 'john_doe@example.com',
        senha: '123',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.senha')
  })

  it('Tenta fazer login sem email', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        senha: '123456',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.email')
  })

  it('Tenta fazer login sem senha', async () => {
    const testResult = await testServer
      .post('/entrar')
      .send({
        email: 'john_doe@example.com',
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.senha')
  })

})