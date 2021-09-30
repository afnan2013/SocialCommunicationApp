import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Auth } from "./auth.model"

@Injectable({providedIn: "root"})
export class AuthService {
  private token: string;

  constructor(private http: HttpClient, private router : Router){}

  onSaveUser(auth: Auth){
    this.http.post<{message: string, authUser: Auth}>("http://localhost:3000/api/users/signup", auth).subscribe(userData=>{
      if (userData.authUser){
        console.log(userData.message);
        // this.router.navigate(["/login"]);
      }else{
        alert("Invalid Input");
      }
    });
  }

  onAuthenticateUser(auth: Auth){
    return this.http.post<{token: string}>("http://localhost:3000/api/users/login", auth).subscribe(userData=>{
      if (userData.token){
        console.log(userData.token);
        this.token = userData.token;
      }
    });;
  }
}
