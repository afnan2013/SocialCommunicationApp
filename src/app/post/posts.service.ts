import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";

import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import { Router } from "@angular/router";



@Injectable({providedIn: "root"})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], maxPostCount: number}>();

  constructor (private http: HttpClient, private router : Router){}

  getPosts(postsPerPage: number, currentPage: number){
    const querystring = `?pagesize=${postsPerPage}&pageindex=${currentPage}`;
    this.http.get<{message: string, posts: any, maxCount: number}>('http://localhost:3000/api/posts'+querystring)
    .pipe(map((postData)=>{
      return {transformedPosts: postData.posts.map((post)=>{
        return {
          imagePath: post.imagePath,
          title: post.title,
          content: post.content,
          id: post._id
        }
      }), maxCount: postData.maxCount};
    }))
    .subscribe((transformedPostData)=>{
      // console.log("Posts Get Successful\n");
      // console.log(transformedPosts)
      this.posts = transformedPostData.transformedPosts;
      this.postsUpdated.next({posts: [...this.posts], maxPostCount:transformedPostData.maxCount});
    });
  }

  getPostsUpdateListener (){
    return this.postsUpdated.asObservable();
  }

  getPost(id:string){
    return this.http.get<{message: string, post: Post}>('http://localhost:3000/api/posts/'+id);
  }

  addPost(post : Post, image: File){
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    postData.append("image", image, post.title);  // second argument is the file name

    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe((responseData)=>{
      // // console.log(responseData.post);
      // post.id = responseData.post.id;
      // post.imagePath = responseData.post.imagePath;
      // this.posts.push(post);
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });

  }

  deletePost(postId: string){
    return this.http.delete<{message: string}>("http://localhost:3000/api/posts/"+postId);
  }

  updatePost(post : Post){
    // console.log(post);
    let postData : Post | FormData;
    if (typeof(post.imagePath) === "string"){
      //console.log("Image Untouched");
      postData = post;
    }else {
      // console.log("Image is changed");
      postData = new FormData();
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("image", post.imagePath, post.title);

    }
    this.http.put<{message: string, updatedPost: Post}>("http://localhost:3000/api/posts/"+post.id, postData).subscribe(response => {
      // console.log(response.message);
      // console.log(response.updatedPost);
      // const updatedPost = [...this.posts];
      // const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      // updatedPost[oldPostIndex] = response.updatedPost;
      // this.posts = updatedPost;
      // this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }
}
