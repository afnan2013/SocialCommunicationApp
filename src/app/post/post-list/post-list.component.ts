import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postsSubscription: Subscription;
  isLoading = false;

  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.getPostsUpdateListener().subscribe(
      (posts: Post[])=>{
        this.posts = posts;
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId : string){
    this.postsService.deletePost(postId);
  }
}
