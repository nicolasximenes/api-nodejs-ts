import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - GetById', ()=> {
  
  let cidadeId: number | undefined = undefined
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades')
      .send({ nome: 'Teste' })

    cidadeId = resCidade.body
  })
  
  
  it('Busca um registro por ID', async () => {
    const testResult = await testServer
      .post('/pessoas')
      .send({
        cidadeId,
        email: 'john_getbyid@example.com',
        nomeCompleto: 'John Doe'
      })
      
    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resBuscada = await testServer
      .get(`/pessoas/${testResult.body}`)
      .send()
      
    expect(resBuscada.statusCode).toEqual(StatusCodes.OK)
    expect(resBuscada.body).toHaveProperty('nomeCompleto')
  })

  it('Tenta buscar um registro que não existe', async () => {
    const testResult = await testServer
      .get('/pessoas/99999')
      .send()
      
    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})