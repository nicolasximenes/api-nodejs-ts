import { Knex } from '../../knex'
import { ETableNames } from '../../ETableNames'

export const count = async (filter = ''): Promise<number | Error> => {
  try {
    // TODO: change const named count to resultCount
    const [{ count }] = await Knex(ETableNames.cidade)
      .where('nome', 'like', `%${filter}%`)
      .count<[{ count: number }]>('* as count')
    if (Number.isInteger(Number(count))) return Number(count)

    return new Error('Erro ao consultar a quantidade total de registros')
  } catch (error) {
    console.log(error)
    return new Error('Erro ao consultar a quantidade total de registros')
  }
  
}