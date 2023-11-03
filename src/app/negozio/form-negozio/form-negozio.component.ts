import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { AuthService } from 'src/app/service/auth.service'
import { StoreNegoziService } from 'src/app/service/store-negozi.service'
import { Negozio } from 'src/app/shared/negozio.model'

@Component({
  selector: 'app-form-negozio',
  templateUrl: './form-negozio.component.html',
  styleUrls: ['./form-negozio.component.css']
})
export class FormNegozioComponent implements OnInit {
  formType: string
  buttonText: string
  negozio: Negozio

  nomeNegozio: string = ''
  pivaNegozio: string = ''

  constructor (
    private storeNegoziService: StoreNegoziService,

    private route: ActivatedRoute
  ) {}

  ngOnInit (): void {
    const queryParams: Params = this.route.snapshot.queryParams
    this.formType = queryParams.type

    this.buttonText = this.formType === 'add' ? 'Aggiungi' : 'Modifica'

    if (this.formType === 'edit') {
      const idNegozio = this.route.parent.snapshot.params.idNegozio

      this.negozio = this.storeNegoziService.getNegozio(idNegozio)

      this.nomeNegozio = this.negozio.nome
      this.pivaNegozio = this.negozio.piva
    }
  }

  onSubmit () {
    if (
      this.nomeNegozio.trim().length !== 0 &&
      this.pivaNegozio.trim().length !== 0
    ) {
      if (this.formType === 'add') {
        this.storeNegoziService.addNegozio({
          nome: this.nomeNegozio,
          piva: this.pivaNegozio,
          prodotti: []
        })
      } else if (this.formType === 'edit') {
        const oldNegozio = this.storeNegoziService.getNegozio(this.negozio.id)
        this.storeNegoziService.updateNegozio(this.negozio.id, {
          nome: this.nomeNegozio,
          piva: this.pivaNegozio,
          prodotti: oldNegozio.prodotti
        })
      }
    }
  }
}
