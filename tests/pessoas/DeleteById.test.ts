import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - DeleteById', ()=> {
  
  let cidadeId: number | undefined = undefined
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Teste' })

    cidadeId = resCidade.body
  })
  
  it('Apaga um registro', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'john_delete@example.com',
        nomeCompleto: 'John Doe'
      })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resApagada = await testServer
      .delete(`/pessoas/${testResult.body}`)
      .send()
      
    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta apagar um registro que não existe', async () => {
    const testResult = await testServer
      .delete('/pessoas/99999')
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})