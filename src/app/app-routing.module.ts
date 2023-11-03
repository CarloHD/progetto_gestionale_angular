import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ProdottoComponent } from './prodotto/prodotto.component'
import { EditProdottoComponent } from './prodotto/edit-prodotto/edit-prodotto.component'
import { NuovoProdottoComponent } from './prodotto/nuovo-prodotto/nuovo-prodotto.component'
import { AuthPageComponent } from './auth-page/auth-page.component'
import { ErrorComponent } from './error/error.component'
import { HomeComponent } from './home/home.component'
import { EditNegozioComponent } from './negozio/edit-negozio/edit-negozio.component'
import { NegozioComponent } from './negozio/negozio.component'
import { NuovoNegozioComponent } from './negozio/nuovo-negozio/nuovo-negozio.component'
import { negozioResolver } from './service/store-negozi.service'
import { authorizedGuard } from './service/auth.service'
import { DetailNegozioComponent } from './negozio/detail-negozio/detail-negozio.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'error-page', component: ErrorComponent },
  {
    path: 'nuovo-negozio',
    component: NuovoNegozioComponent,
    canActivate: [authorizedGuard]
  },
  { path: 'login', component: AuthPageComponent },
  {
    path: ':idNegozio',
    component: NegozioComponent,
    canActivateChild: [authorizedGuard],
    resolve: { negozio: negozioResolver },
    children: [
      { path: '', component: DetailNegozioComponent },
      {
        path: 'nuovo-prodotto',
        component: NuovoProdottoComponent
      },
      { path: 'edit', component: EditNegozioComponent },
      { path: ':idProdotto', component: ProdottoComponent },
      {
        path: ':idProdotto/edit',
        component: EditProdottoComponent
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })
  ],
  exports: [RouterModule]
})
export class AppRouterModule {}
