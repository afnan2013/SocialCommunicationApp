import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Auth } from "../auth.model";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService){}

  onSignup(form: NgForm){
    // this.isLoading = true;
    // console.log(form.value);
    if (form.invalid){
      return;
    }
    const auth: Auth = {
      email: form.value.email,
      password: form.value.password
    };
    this.authService.onSaveUser(auth);
  }
}

