import { StatusCodes } from 'http-status-codes'
import { testServer } from '../jest.setup'

describe('Cidades - DeleteById', ()=> {
  
  let accessToken = ''
  beforeAll(async () => {
    const email = 'deletebyid_cidades@gmail.com'
    await testServer.post('/cadastrar').send({ nome: 'Teste', email, senha: '123456' })
    const signInRes = await testServer.post('/entrar').send({ email, senha: '123456' })
    
    accessToken = signInRes.body.accessToken
  })

  it('Tenta apagar um registro sem token de acesso', async () => {
    const testResult = await testServer
      .delete('/cidades/1')
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(testResult.body).toHaveProperty('errors.default')
  })
  
  it('Apaga um registro', async () => {
    const testResult = await testServer
      .post('/cidades')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'São Roque' })

    expect(testResult.statusCode).toEqual(StatusCodes.CREATED)
    
    const resApagada = await testServer
      .delete(`/cidades/${testResult.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
    
    expect(resApagada.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta apagar um registro que não existe', async () => {
    const testResult = await testServer
      .delete('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(testResult.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(testResult.body).toHaveProperty('errors.default')
  })

})