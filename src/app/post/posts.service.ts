import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";

import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import { Router } from "@angular/router";


@Injectable({providedIn: "root"})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor (private http: HttpClient, private router : Router){}

  getPosts(){
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map((post)=>{
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
    }))
    .subscribe((transformedPosts)=>{
      console.log("Posts Get Successful");
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostsUpdateListener (){
    return this.postsUpdated.asObservable();
  }

  getPost(id:string){
    return this.http.get<{message: string, post: Post}>('http://localhost:3000/api/posts/'+id);
  }

  addPost(post : Post){
    this.http.post<{message: string, postId:string}>('http://localhost:3000/api/posts', post).subscribe((responseData)=>{
      //console.log(responseData.postId);
      post.id = responseData.postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });

  }

  deletePost(postId: string){
    this.http.delete<{message: string}>("http://localhost:3000/api/posts/"+postId).subscribe((response)=>{
      this.posts = this.posts.filter(post => post.id !== postId);
      this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(post : Post){
    this.http.put<{message: string}>("http://localhost:3000/api/posts/"+post.id, post).subscribe(response => {
      console.log(response.message);
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }
}
