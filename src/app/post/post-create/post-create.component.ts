import { Component } from "@angular/core";

@Component({
  selector:"app-post-create",
  templateUrl:"./post-create.component.html"
})
export class PostCreateComponent {

  postInput = "";
  newPost = "NO CONTENT";

  addPost(){
    this.newPost = this.postInput;
  }
}
