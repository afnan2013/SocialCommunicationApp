import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { Auth } from "./auth.model"

@Injectable({providedIn: "root"})
export class AuthService {
  private token: string;
  private userAuthListener = new Subject<boolean>();
  private isUserAuthenticated:boolean = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router : Router){}

  getToken(){
    return this.token;
  }

  getAuthStatus (){
    return this.isUserAuthenticated;
  }

  getUserAuthListener (){
    return this.userAuthListener.asObservable();
  }

  onSaveUser(auth: Auth){
    this.http.post<{message: string, authUser: Auth}>("http://localhost:3000/api/users/signup", auth).subscribe(userData=>{
      if (userData.authUser){
        console.log(userData.message);
        this.router.navigate(["/login"]);
      }else{
        console.log(userData.authUser);
        alert("Invalid Input");
      }
    });
  }

  onAuthenticateUser(auth: Auth){
    return this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/users/login", auth).subscribe(userData=>{
      if (userData.token){
        const expiresInDuration = userData.expiresIn;
        this.tokenTimer = setTimeout(()=>{
          this.logout();
        }, expiresInDuration*1000);
        this.token = userData.token;
        this.isUserAuthenticated = true;
        this.userAuthListener.next(true);
        this.router.navigate(["/"]);
      }
    });;
  }

  logout(){
    this.token = null;
    this.isUserAuthenticated = false;
    this.userAuthListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(["/login"]);
  }
}
