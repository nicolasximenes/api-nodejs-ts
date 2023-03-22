import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - GetById', ()=> {
  
  // it() -> test scenario or test case
  
  
  it('Busca um registro por ID', async () => {
    const testResult = await testServer
      .post('/cidades')
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resBuscada = await testServer
      .get(`/cidades/${testResult.body}`)
      .send()
    
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK)
    expect(resBuscada.body).toHaveProperty('nome')
  })

  it('Tenta buscar um registro que não existe', async () => {
    const testResult = await testServer
      .get('/cidades/99999')
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})