import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from "../post.model";

@Component({
  selector:"app-post-create",
  templateUrl:"./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {

  @Output('newPostAdded') addNewPost = new EventEmitter<Post>();

  newPostTitle = "";
  newPostContent = "";

  onPostAdded(){
    const post = {
      title: this.newPostTitle,
      content: this.newPostContent
    }
    this.addNewPost.emit(post);
    this.newPostContent = "";
    this.newPostTitle = "";
  }
}
