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
        // Token Timeout Function
        this.setTokenTimer(expiresInDuration);
        this.token = userData.token;
        this.isUserAuthenticated = true;
        this.userAuthListener.next(true);
        // Save Auth Data
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration*1000);
        this.saveAuthData(this.token, expirationDate);
        this.router.navigate(["/"]);
      }
    });;
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = authInformation.token;
      this.isUserAuthenticated = true;
      this.setTokenTimer(expiresIn/1000);
      this.userAuthListener.next(true);
    }

  }

  logout(){
    this.token = null;
    this.isUserAuthenticated = false;
    this.userAuthListener.next(false);
    // Clear Token Timeout Function
    clearTimeout(this.tokenTimer);
    // Clear Auth Data
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private setTokenTimer (duration: number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration*1000);
  }

  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData (){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");

    if(!token || !expiration){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expiration)
    }
  }
}
