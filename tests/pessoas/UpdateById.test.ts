import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Pessoas - UpdateById', ()=> {

  let cidadeId: number | undefined = undefined
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Teste' })

    cidadeId = resCidade.body
  })
  
  it('Atualiza um registro por ID', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'john_updatebyid@example.com',
        nomeCompleto: 'John Doe'
      })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    
    const resAtualizada = await testServer
      .put(`/pessoas/${testResult.body}`)
      .send({
        cidadeId,
        email: 'john_updatebyid_ok@example.com',
        nomeCompleto: 'John Doe'
      })

    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta atualizar um registro que não existe', async () => {
    const testResult = await testServer
      .put('/pessoas/99999')
      .send({
        cidadeId,
        email: 'john@example.com',
        nomeCompleto: 'John Doe'
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})