import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - UpdateById', ()=> {
  
  it('Atualiza um registro por ID', async () => {
    const testResult = await testServer
      .post('/cidades')
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    
    const resAtualizada = await testServer
      .put(`/cidades/${testResult.body}`)
      .send({ nome: 'San Rock' })
    
    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta atualizar um registro que não existe', async () => {
    const testResult = await testServer
      .put('/cidades/99999')
      .send({ nome: 'San Rock' })

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})