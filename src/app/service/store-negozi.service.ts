import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subscription, map, tap } from 'rxjs'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot
} from '@angular/router'

import { Negozio } from '../shared/negozio.model'
import { Prodotto } from '../shared/prodotto.model'
import { AuthService } from './auth.service'
import { resStore } from '../shared/firebase.model'

@Injectable({
  providedIn: 'root'
})
export class StoreNegoziService {
  isLogged: boolean
  isLoggedSub: Subscription

  listaNegozi: Negozio[] = []
  listaNegoziEmit = new BehaviorSubject<Negozio[]>(this.listaNegozi)

  constructor (
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isLoggedSub = this.authService.usernameEmitter.subscribe(username => {
      if (username) {
        this.fetchNegozi().subscribe()
      } else {
        this.listaNegozi = []
        this.listaNegoziEmit.next(this.listaNegozi)
      }
      this.isLogged = !!username
    })
  }

  fetchNegozi () {
    return this.http
      .get<{
        [k: string]: {
          nome: string
          piva: string
          prodotti: { [k: string]: Prodotto }
        }
      }>('negozi')
      .pipe(
        map(resNegozi => {
          const parsedNegozi: Negozio[] = []
          for (const keyN in resNegozi) {
            const parsedProdotti: Prodotto[] = []
            if (resNegozi[keyN].prodotti) {
              for (const keyP in resNegozi[keyN].prodotti) {
                parsedProdotti.push({
                  nome: resNegozi[keyN].prodotti[keyP].nome,
                  prezzo: resNegozi[keyN].prodotti[keyP].prezzo,
                  quantitativo: resNegozi[keyN].prodotti[keyP].quantitativo,
                  id: keyP
                })
              }
            }

            parsedNegozi.push({
              id: keyN,
              nome: resNegozi[keyN].nome,
              piva: resNegozi[keyN].piva,
              prodotti: parsedProdotti
            })
          }

          return parsedNegozi
        }),
        tap((resNegozi: Negozio[]) => {
          this.listaNegozi = resNegozi
          this.listaNegoziEmit.next(this.listaNegozi)
        })
      )
  }

  getNegozio (idNegozio: string) {
    const selectNegozio = this.listaNegozi.find(n => n.id === idNegozio)

    return selectNegozio
  }
  addNegozio (nuovoNegozio: Negozio) {
    this.http.post<resStore>('negozi', nuovoNegozio).subscribe({
      next: res => {
        this.fetchNegozi().subscribe({
          next: () => this.router.navigate([res.name])
        })
      }
    })
  }
  removeNegozio (idNegozio: string) {
    this.http.delete(idNegozio).subscribe({
      next: () => {
        this.fetchNegozi().subscribe({
          next: () => this.router.navigate(['/'])
        })
      }
    })
  }
  updateNegozio (idNegozio: string, updatedNegozio: Negozio) {
    this.http.patch(idNegozio, updatedNegozio).subscribe({
      next: res => {
        this.fetchNegozi().subscribe({
          next: () => this.router.navigate([idNegozio])
        })
      }
    })
  }

  getProdotto (idNegozio: string, idProdotto: string) {
    const negozio = this.getNegozio(idNegozio)
    if (negozio) {
      const prodotto = negozio.prodotti.find(p => p.id === idProdotto)
      return prodotto
    }
    return
  }
  addProdotto (idNegozio: string, nuovoProdotto: Prodotto) {
    const prodotto = new Prodotto(
      nuovoProdotto.nome,
      nuovoProdotto.prezzo,
      nuovoProdotto.quantitativo
    )
    this.http.post<resStore>(idNegozio + '/prodotti', prodotto).subscribe({
      next: resStore => {
        this.fetchNegozi().subscribe({
          next: () => {
            this.router.navigate([idNegozio, resStore.name])
          }
        })
      }
    })
  }
  removeProdotto (idNegozio: string, idProdotto: string) {
    this.http.delete(idNegozio + '/prodotti/' + idProdotto).subscribe({
      next: () => {
        this.fetchNegozi().subscribe({
          next: () => this.router.navigate([idNegozio])
        })
      }
    })

    // const negozio = this.listaNegozi.find(negozio => negozio.piva === piva)
    // if (negozio) {
    //   const indexProdotto = negozio.prodotti.findIndex(
    //     prodotto => prodotto.id === idProdotto
    //   )
    //   negozio.prodotti.splice(indexProdotto, 1)
    //   this.updateNegozio(negozio.piva, negozio)
    // }
  }
  updateProdotto (
    idNegozio: string,
    idProdotto: string,
    updatedProdotto: Prodotto
  ) {
    this.http
      .patch<resStore>(idNegozio + '/prodotti/' + idProdotto, updatedProdotto)
      .subscribe({
        next: res => {
          this.fetchNegozi().subscribe({
            next: () => this.router.navigate([idNegozio, idProdotto])
          })
        }
      })

    // const negozio = this.listaNegozi.find((negozio) => negozio.piva === piva);
    // const prodotto = negozio.products.find(
    //   (prodotto) => prodotto.id === idProdotto
    // );
    // prodotto.nome = nuovoProdotto.nome;
    // prodotto.descrizione = nuovoProdotto.descrizione;
    // prodotto.prezzo = nuovoProdotto.prezzo;
    // prodotto.quantita = nuovoProdotto.quantita;
    // prodotto.imgPath = nuovoProdotto.imgPath;
  }
}

export const negozioResolver: ResolveFn<Negozio[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storeNegoziService = inject(StoreNegoziService)

  if (storeNegoziService.listaNegozi.length === 0) {
    return storeNegoziService.fetchNegozi()
  }
}
