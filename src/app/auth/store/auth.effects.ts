import {Actions, ofType, Effect} from '@ngrx/effects'
import * as AuthActions from './auth.actions'
import { switchMap, catchError, map, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { User } from '../user.model'
import { AuthService } from '../auth.service'

export interface AuthResponseData {
    kind: string
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?: boolean
}

const handleAuthentication = (expiresin: number, email: string, userId: string, token: string ) => {
    const expirationDate = new Date(
        new Date().getTime() + expiresin * 1000
    )
    const user = new User(email, userId, token, expirationDate)
    localStorage.setItem('userData', JSON.stringify(user))
    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate
    })
}

const handleError = (error: any) => {
    return of(new AuthActions.AuthenticateFail(error))
}

@Injectable()
export class AuthEffects {
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=', {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
              })
              .pipe(
                tap(resData => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
              }),
              catchError(error => {
                return handleError(error)
          }))
        })
    )

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=', {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecureToken: true
              })
              .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
              }),
              catchError(error => {
                return handleError(error)
          }))
        })
    ) 
    

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/'])
        })
    )
    
    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {email, id, _token, _tokenExpiresIn} = JSON.parse(localStorage.getItem('userData'))
            if (!userData) {
                return { type: 'Dummy' }
            }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpiresIn))
        if(loadedUser.token) {
            const expirationDuration = new Date(userData._tokenExpiresIn).getTime() - new Date().getTime()
            this.authService.setLogoutTimer(expirationDuration)
            return new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpiresIn)
            })
        }
        return { type: 'Dummy' }
        })
    ) 


    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer()
            localStorage.removeItem('userData')
            this.router.navigate(['/auth'])
    }))

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService){}
}
