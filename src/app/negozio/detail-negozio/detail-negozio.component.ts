import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { Negozio } from '../../shared/negozio.model'
import { StoreNegoziService } from '../../service/store-negozi.service'
import { AuthService } from '../../service/auth.service'

@Component({
  selector: 'app-detail-negozio',
  templateUrl: './detail-negozio.component.html',
  styleUrls: ['./detail-negozio.component.css']
})
export class DetailNegozioComponent implements OnInit {
  negozio: Negozio = { id: '', piva: '', nome: '', prodotti: [] }
  isLogged: boolean

  constructor (
    private storeNegoziService: StoreNegoziService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit (): void {
    this.route.params.subscribe(data => {
      const loadedNegozio = this.storeNegoziService.getNegozio(data.idNegozio)

      if (loadedNegozio === undefined) {
        return this.router.navigate(['/error-page'])
      } else {
        this.negozio = loadedNegozio
      }
    })

    this.authService.usernameEmitter.subscribe(username => {
      this.isLogged = !!username
    })
  }

  onRemoveNegozio () {
    this.storeNegoziService.removeNegozio(this.negozio.id)
  }
}
