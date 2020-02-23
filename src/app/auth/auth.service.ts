import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { Storage } from  '@ionic/storage';
import { User } from  './user';
import { AuthResponse } from  './auth-response';
import 'rxjs/add/observable/fromPromise';
import { CanActivate,Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

AUTH_SERVER_ADDRESS:  string  =  'http://localhost:3001';
authSubject  =  new  BehaviorSubject(false);
public token: string;
public currentUser:any;

constructor(private  httpClient:  HttpClient, private  storage:  Storage, private  router:  Router) { 
   // this.storage.get('ACCESS_TOKEN').then((data)=>{
   //   this.token=data;
   //  });
}

 register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/user/register`, user).pipe(
      tap(async (res:  AuthResponse ) => {

        if (res['access_token']) {
          await this.storage.set("ACCESS_TOKEN", res['access_token']);
          await this.storage.set("EXPIRES_IN", res['expires_in']);
          await this.storage.set("userId", res['user']['id']);
          this.authSubject.next(true);
        }
      })

    );
  }


  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/user/login`, user).pipe(
      tap(async (res: AuthResponse) => {

        if (res['access_token']) {
          await this.storage.set("ACCESS_TOKEN", res['access_token']);
          await this.storage.set("EXPIRES_IN", res['expires_in']);
          await this.storage.set("userId", res['user']['id']);
          this.authSubject.next(true);
        }
      })
    );
  }
  async logout() {
    await this.storage.remove("ACCESS_TOKEN");
    await this.storage.remove("EXPIRES_IN");
    await this.storage.remove("userId");
    this.authSubject.next(false);
    this.router.navigateByUrl('login');

  }
  
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
  canActivate():Observable<boolean> {
      return this.gettoken().map( api_token => {
        if(api_token!=''&&api_token!=null)
          return true;
        else
        {
          this.router.navigateByUrl('login');
          return false;
        }
      });
  }
  gettoken(): Observable<any>
  {
    return Observable.fromPromise(this.storage.get('ACCESS_TOKEN'));
  }
  getuser(): Observable<any>
  {
    return Observable.fromPromise(this.storage.get('userId'));
  }
}
