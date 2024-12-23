import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Actions, ofType, Effect } from '@ngrx/effects'; // Effect is not supported by recent versions of NgRx
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  private readonly apiUrl = environment.back4App.url;
  private readonly headers = new HttpHeaders({
    'X-Parse-Application-Id': environment.back4App.appId,
    'X-Parse-REST-API-Key': environment.back4App.restApiKey,
    'Content-Type': 'application/json',
  });
  authLogin = createEffect(() =>
    this.actions$.pipe(
      // oftype = allow you to find fillter that you want to countinu
      ofType(AuthActions.LOGIN_START),
      // Alternative syntax:
      // ofType(AuthActions.loginStart),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            this.apiUrl,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            },
            { headers: this.headers }

            // Alternative syntax:
            // {
            //   email: authData.email,
            //   password: authData.password,
            //   returnSecureToken: true
            // }
          )
          .pipe(
            map((resData) => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return new AuthActions.AuthenticateSuccess({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              });
              // Alternative syntax:
              // return new AuthActions.login({
              //   email: resData.email,
              //   userId: resData.localId,
              //   token: resData.idToken,
              //   expirationDate: expirationDate
              // });
            }),
            catchError((errorRes) => {
              let errorMessage = 'An unknown error occurred!';
              if (!errorRes.error || !errorRes.error.error) {
                return of(new AuthActions.AuthenticateFail(errorMessage));
                // Alternative syntax:
                // return of(
                //   new AuthActions.loginFail({error: errorMessage})
                // );
              }
              switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                  errorMessage = 'This email exists already';
                  break;
                case 'EMAIL_NOT_FOUND':
                  errorMessage = 'This email does not exist.';
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage = 'This password is not correct.';
                  break;
              }
              return of(new AuthActions.AuthenticateFail(errorMessage));
              // Alternative syntax:
              // return of(
              //   new AuthActions.loginFail({error: errorMessage})
              // );
            })
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}

// Old syntax:
// Using @Effect() (which is not supported by recent NgRx versions).
// @Injectable()
// export class AuthEffects {
//   @Effect()
//   authLogin = this.actions$.pipe(
//     ofType(AuthActions.LOGIN_START),
//     switchMap((authData: AuthActions.LoginStart) => {
//       return this.http
//         .post<AuthResponseData>(
//           ' ' +
//             environment.back4app,
//           {
//             email: authData.payload.email,
//             password: authData.payload.password,
//             returnSecureToken: true
//           }
//         )
//         .pipe(
//           map(resData => {
//             const expirationDate = new Date(
//               new Date().getTime() + +resData.expiresIn * 1000
//             );
//             return new AuthActions.Login({
//               email: resData.email,
//               userId: resData.localId,
//               token: resData.idToken,
//               expirationDate: expirationDate
//             });
//           }),
//           catchError(errorRes => {
//             let errorMessage = 'An unknown error occurred!';
//             if (!errorRes.error || !errorRes.error.error) {
//               return of(new AuthActions.LoginFail(errorMessage));
//             }
//             switch (errorRes.error.error.message) {
//               case 'EMAIL_EXISTS':
//                 errorMessage = 'This email exists already';
//                 break;
//               case 'EMAIL_NOT_FOUND':
//                 errorMessage = 'This email does not exist.';
//                 break;
//               case 'INVALID_PASSWORD':
//                 errorMessage = 'This password is not correct.';
//                 break;
//             }
//             return of(new AuthActions.LoginFail(errorMessage));
//           })
//         );
//     })
//   );

//   @Effect({ dispatch: false })
//   authSuccess = this.actions$.pipe(
//     ofType(AuthActions.LOGIN),
//     tap(() => {
//       this.router.navigate(['/']);
//     })
//   );

//   constructor(
//     private actions$: Actions,
//     private http: HttpClient,
//     private router: Router
//   ) {}
// }

// 496
