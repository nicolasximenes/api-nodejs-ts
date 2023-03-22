import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - DeleteById', ()=> {
  
  // it() -> test scenario or test case
  
  
  it('Apaga um registro', async () => {
    const testResult = await testServer
      .post('/cidades')
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resApagada = await testServer
      .delete(`/cidades/${testResult.body}`)
      .send()
    
    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta apagar um registro que não existe', async () => {
    const testResult = await testServer
      .delete('/cidades/99999')
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})