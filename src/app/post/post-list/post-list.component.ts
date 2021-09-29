import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  totalPosts: number = 5;
  currentPage: number = 1;
  postsPerPage: number = 2;
  postsPerPageOptions: number[] = [1,2,3,4,5];
  private postsSubscription: Subscription;
  isLoading = false;

  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
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

  onChangedPage(pageData : PageEvent){
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
