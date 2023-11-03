import { Prodotto } from './prodotto.model'

export interface Negozio {
  id?: string
  piva: string
  nome: string
  prodotti: Prodotto[]
}
