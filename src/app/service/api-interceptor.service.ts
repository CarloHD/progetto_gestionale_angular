import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

const apiKey = 'AIzaSyDMZg-c6WN96CkS9plnTFDwOGWapaDPzFU '

const authRegisterEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`

const authLoginEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`

const storeEndpoint =
  'https://gestionale-angular-chd-default-rtdb.europe-west1.firebasedatabase.app/negozi'

@Injectable({ providedIn: 'root' })
export class APIInterceptor implements HttpInterceptor {
  intercept (
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = localStorage.getItem('userToken')

    let newUrl: string
    let newRequestHeaders: HttpHeaders = req.headers
    let editRequest: HttpRequest<any>

    switch (req.url) {
      case 'register':
        newUrl = authRegisterEndpoint
        newRequestHeaders.set('Content-Type', 'application/json')
        editRequest = req.clone({
          url: newUrl,
          headers: newRequestHeaders
        })
        break

      case 'login':
        newUrl = authLoginEndpoint
        newRequestHeaders.set('Content-Type', 'application/json')
        editRequest = req.clone({
          url: newUrl,
          headers: newRequestHeaders
        })
        break

      case 'negozi':
        if (userToken) {
          newUrl = storeEndpoint + '.json?auth=' + userToken

          editRequest = req.clone({
            url: newUrl
          })
        }
        break

      default:
        if (userToken) {
          newUrl = `${storeEndpoint}/${req.url}.json?auth=${userToken}`
          editRequest = req.clone({
            url: newUrl
          })
        }
        break
    }

    return next.handle(editRequest)
  }
}
