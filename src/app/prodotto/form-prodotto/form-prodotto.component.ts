import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { AuthService } from 'src/app/service/auth.service'
import { StoreNegoziService } from 'src/app/service/store-negozi.service'
import { Prodotto } from 'src/app/shared/prodotto.model'

@Component({
  selector: 'app-form-prodotto',
  templateUrl: './form-prodotto.component.html',
  styleUrls: ['./form-prodotto.component.css']
})
export class FormProdottoComponent implements OnInit {
  isLogged: boolean

  formType: string
  buttonText: string = 'Modifica'
  prodotto: Prodotto

  nomeProdotto: string = ''
  quantitaProdotto: number = 0
  prezzoProdotto: number = 0.0
  // descrizioneProdotto: string = ''
  // imgPathProdotto: string = ''

  constructor (
    private storeNegoziService: StoreNegoziService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit (): void {
    this.isLogged = !!this.authService.username
    this.authService.usernameEmitter.subscribe(isLogged => {
      this.isLogged = !!isLogged
    })
    const queryParams: Params = this.route.snapshot.queryParams
    this.formType = queryParams.type
    this.buttonText = this.formType === 'add' ? 'Aggiungi' : 'Modifica'
    if (this.formType === 'edit') {
      this.prodotto = this.storeNegoziService.getProdotto(
        this.route.snapshot.params.idNegozio,
        this.route.snapshot.params.idProdotto
      )
      this.nomeProdotto = this.prodotto.nome
      this.quantitaProdotto = this.prodotto.quantitativo
      this.prezzoProdotto = this.prodotto.prezzo
      // this.descrizioneProdotto = this.prodotto.descrizione
      // this.imgPathProdotto = this.prodotto.imgPath
    }
  }

  onSubmit () {
    if (
      this.nomeProdotto.trim().length !== 0
      // &&this.descrizioneProdotto.trim().length !== 0 &&
      // this.imgPathProdotto.trim().length !== 0
    ) {
      if (this.formType === 'add') {
        const idNegozio: string = this.route.snapshot.params.idNegozio
        // const idNuovoProdotto = Math.floor(Math.random() * 1000)
        this.storeNegoziService.addProdotto(idNegozio, {
          nome: this.nomeProdotto,
          prezzo: this.prezzoProdotto,
          quantitativo: this.quantitaProdotto
          //       descrizione: this.descrizioneProdotto,
          //       imgPath: this.imgPathProdotto
        })
      }
      if (this.formType === 'edit') {
        const idNegozio: string = this.route.snapshot.params.idNegozio
        this.storeNegoziService.updateProdotto(idNegozio, this.prodotto.id, {
          nome: this.nomeProdotto,
          prezzo: this.prezzoProdotto,
          quantitativo: this.quantitaProdotto
          //       descrizione: this.descrizioneProdotto,
          //       imgPath: this.imgPathProdotto
        })
      }
    }
  }
}
