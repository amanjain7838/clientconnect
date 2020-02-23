import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs/Observable';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import 'rxjs/add/operator/mergeMap';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // result: Observable<any>;

  constructor(public httpClient: HttpClient,private  authService:  AuthService) { }
    userdata(): Observable<any>{
      return this.authService.gettoken().flatMap( api_token => {
        var headers_object = new HttpHeaders({
          'Content-Type': 'application/json',
           'Authorization': "Bearer "+api_token
        });
        const httpOptions = {
          headers: headers_object
        };
  	    return this.httpClient.get('http://localhost:3001/user/view?user=1',httpOptions);
      });
    }
    userid(): Observable<any>{
      let userdetails=[];
      return this.authService.getuser().map( userid => {
        userdetails['id']=userid;
        return userdetails;
      });
    }
}
