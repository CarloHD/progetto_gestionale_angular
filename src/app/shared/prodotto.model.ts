export class Prodotto {
  constructor (
    public nome: string,
    public prezzo: number,
    public quantitativo: number,
    public id?: string
  ) {}
}
