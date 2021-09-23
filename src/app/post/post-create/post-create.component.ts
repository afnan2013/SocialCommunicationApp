import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector:"app-post-create",
  templateUrl:"./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit{
  private mode: string = 'create';
  private postId: string;
  post: Post;
  isLoading = false;

  constructor(public postsService: PostsService, private route: ActivatedRoute){};

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId');

        this.postsService.getPost(this.postId).subscribe(responseData => {
          // console.log(responseData.post);
          this.post = {
            id: responseData.post.id,
            title: responseData.post.title,
            content: responseData.post.content
          };
          this.isLoading = false;
        });
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create'){
      const post: Post = {
        id: null,
        title: form.value.title,
        content: form.value.content
      }
      this.postsService.addPost(post);
    }else{
      const post: Post = {
        id: this.postId,
        title: form.value.title,
        content: form.value.content
      }
      this.postsService.updatePost(post);
    }
    form.resetForm();
  }
}
