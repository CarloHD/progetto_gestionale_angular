import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NegozioComponent } from './negozio/negozio.component';

import { ProdottoComponent } from './prodotto/prodotto.component';
import { NuovoNegozioComponent } from './negozio/nuovo-negozio/nuovo-negozio.component';
import { HomeComponent } from './home/home.component';
import { FormNegozioComponent } from './negozio/form-negozio/form-negozio.component';
import { EditNegozioComponent } from './negozio/edit-negozio/edit-negozio.component';
import { EditProdottoComponent } from './prodotto/edit-prodotto/edit-prodotto.component';
import { FormProdottoComponent } from './prodotto/form-prodotto/form-prodotto.component';
import { NuovoProdottoComponent } from './prodotto/nuovo-prodotto/nuovo-prodotto.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { ErrorComponent } from './error/error.component';
import { FirstCharUppercasePipe } from './shared/first-char-uppercase.pipe';
import { AppRouterModule } from './app-routing.module';
import { DetailNegozioComponent } from './negozio/detail-negozio/detail-negozio.component';
import { APIInterceptor } from './service/api-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NegozioComponent,
    DetailNegozioComponent,
    ProdottoComponent,
    NuovoNegozioComponent,
    HomeComponent,
    FormNegozioComponent,
    EditNegozioComponent,
    EditProdottoComponent,
    FormProdottoComponent,
    NuovoProdottoComponent,
    ErrorComponent,
    AuthPageComponent,
    FirstCharUppercasePipe,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
