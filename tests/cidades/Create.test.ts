import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - Create', ()=> {
  
  // it() -> test scenario or test case
  
  
  it('Cria um registro', async () => {
    const testResult = await testServer
      .post('/cidades')
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof testResult.body).toEqual('number')
  })

  it('Tenta criar um registro com o nome muito curto', async () => {
    const testResult = await testServer
      .post('/cidades')
      .send({ nome: 'Sa' })

    expect(testResult.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(testResult.body).toHaveProperty('errors.body.nome')
  })

})