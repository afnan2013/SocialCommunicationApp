import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy{
  authListenerSubs: Subscription;
  isAuthenticated: boolean = false;
  constructor(public authService: AuthService){}

  ngOnInit(){
    this.authListenerSubs = this.authService.getUserAuthListener().subscribe((isUserAuthenticated: boolean)=>{
      console.log("header: "+isUserAuthenticated);
      this.isAuthenticated = isUserAuthenticated;
    });
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}
