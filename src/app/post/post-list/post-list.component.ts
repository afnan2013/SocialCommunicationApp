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
  totalPosts: number = 0;
  // We can make this page properties dynamic from the user
  currentPage: number = 1;
  postsPerPage: number = 5;
  postsPerPageOptions: number[] = [1,2,3,4,5];
  private postsSubscription: Subscription;
  isLoading = false;

  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSubscription = this.postsService.getPostsUpdateListener().subscribe(
      (postData:{ posts: Post[],maxPostCount: number})=>{
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.maxPostCount;
      }
    );
  }

  ngOnDestroy(){
    this.postsSubscription.unsubscribe();
  }

  onDelete(postId : string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe((response)=>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    });;
  }

  onChangedPage(pageData : PageEvent){
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
