import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - UpdateById', ()=> {

  let accessToken = ''
  beforeAll(async () => {
    const email = 'updatebyid_cidades@gmail.com'
    await testServer.post('/cadastrar').send({ nome: 'Teste', email, senha: '123456' })
    const signInRes = await testServer.post('/entrar').send({ email, senha: '123456' })
    
    accessToken = signInRes.body.accessToken
  })

  it('Tenta atualizar sem usar token de autorização', async () => {
    const testResult = await testServer
      .put('/cidades/1')
      .send({ nome: 'San Rock' })

    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  it('Atualiza um registro por ID', async () => {
    const testResult = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    
    const resAtualizada = await testServer
      .put(`/cidades/${testResult.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'San Rock' })
    
    expect(resAtualizada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta atualizar um registro que não existe', async () => {
    const testResult = await testServer
      .put('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'San Rock' })

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})