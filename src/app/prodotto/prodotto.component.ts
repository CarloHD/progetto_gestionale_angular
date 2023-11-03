import { Component, OnInit } from '@angular/core'
import { StoreNegoziService } from '../service/store-negozi.service'
import { Prodotto } from '../shared/prodotto.model'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../service/auth.service'

@Component({
  selector: 'app-prodotto',
  templateUrl: './prodotto.component.html',
  styleUrls: ['./prodotto.component.css']
})
export class ProdottoComponent implements OnInit {
  prodotto: Prodotto
  isLogged: boolean
  constructor (
    private storeNegoziService: StoreNegoziService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit (): void {
    this.route.params.subscribe(({ idNegozio, idProdotto }) => {
      const loadedProdotto = this.storeNegoziService.getProdotto(
        idNegozio,
        idProdotto
      )

      if (loadedProdotto === undefined) {
        return this.router.navigate(['/error-page'])
      } else {
        this.prodotto = loadedProdotto
      }
    })

    this.authService.usernameEmitter.subscribe(username => {
      this.isLogged = !!username
    })
  }

  onRemoveProdotto () {
    const idNegozio = this.route.snapshot.params.idNegozio

    this.storeNegoziService.removeProdotto(idNegozio, this.prodotto.id)
  }
}
