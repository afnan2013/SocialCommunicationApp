import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "../auth.model";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  isLoading = false;

  constructor (public authService:AuthService, public router: Router) {}

  onLogin(form: NgForm){
    // console.log(form.value);
    if (form.invalid){
      return;
    }
    const auth: Auth = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.onAuthenticateUser(auth);
  }
}
