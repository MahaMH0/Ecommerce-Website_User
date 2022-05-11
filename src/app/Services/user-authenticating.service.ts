import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../Models/IUser';
import { Login } from '../ViewModels/Login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticatingService{
  private HttpOptions;
  private ISLoggedSubject:BehaviorSubject<boolean>;
  private UserLogin:Login;
  UserToken: any;
  tokendata:any;
  role:any;
  constructor(private HttpClientService: HttpClient
    ,private jwtHelper:JwtHelperService) { 
    this.HttpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
       //, 'Authorization': `${localStorage.getItem("tokendata")}`
      })
    }

    this.ISLoggedSubject=new BehaviorSubject<boolean>(((localStorage.getItem('token') !=undefined) &&
    (this.jwtHelper.isTokenExpired(localStorage.getItem('tokendata')!) != true))
     ? true : false);
    this.UserLogin={ userName:"",password:""};
  }

  public getToken(): string {
    return localStorage.getItem('tokendata')!;
  }


   Register(newUser:IUser): Observable<IUser>
   {
    return this.HttpClientService.post<IUser>(`${environment.APIBaseURL}/api/Account/Register`, JSON.stringify(newUser),this.HttpOptions);
   }
   Login(UserName:string, Password:string): Observable<Login>
   {
      this.UserLogin.userName=UserName;
      this.UserLogin.password=Password;

  return this.HttpClientService.post<Login>(`${environment.APIBaseURL}/api/Account/Login`,
   JSON.stringify(this.UserLogin),this.HttpOptions).pipe(map(
     usertoken=>{
      this.UserToken=usertoken;
      this.tokendata=this.UserToken.token;

      this.role=this.UserToken.role;
      console.log("Token",this.UserToken);
      console.log("Tokendata",this.tokendata);
      console.log("Role",this.role);
      localStorage.setItem("token",this.UserToken);
      localStorage.setItem("tokendata",this.tokendata);
      localStorage.setItem("role",this.role);
      this.ISLoggedSubject.next(true);
      return usertoken;
     }
   ));   
   }
  
   Logout()
   {
      localStorage.removeItem("token");
      console.log("IsLogged",this.ISloggedin);
      this.ISLoggedSubject.next(false);
   }
   get ISloggedin(): boolean
   {
      return localStorage.getItem("token") ? true:false;
   }


   getCurrentUser() :Observable<IUser>
   {
      return this.HttpClientService.get<IUser>(`${environment.APIBaseURL}/api/Account`,this.HttpOptions);
   }

   updateUser(newUser: IUser) :Observable<IUser>
   {
     return this.HttpClientService.put<IUser>(`${environment.APIBaseURL}/api/Account/Edit`,JSON.stringify(newUser),this.HttpOptions);
   }

   getStatusLoging() :Observable<boolean>
   {
    console.log(this.ISLoggedSubject);
     return this.ISLoggedSubject.asObservable();
   }
}
