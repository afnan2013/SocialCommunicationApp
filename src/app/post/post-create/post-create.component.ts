import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { stringify } from "querystring";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { mimeTypeValidator } from "./mime-type.validator";

@Component({
  selector:"app-post-create",
  templateUrl:"./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit{
  form: FormGroup;
  private mode: string = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  imageUrl: string  ;

  constructor(public postsService: PostsService, private route: ActivatedRoute){};

  ngOnInit(){
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeTypeValidator]})
    });

    // Only work for Edit
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = "edit";
        this.postId = paramMap.get('postId');

        this.postsService.getPost(this.postId).subscribe(responseData => {
          this.isLoading = false;
          // console.log(responseData.post);
          this.post = {
            id: responseData.post.id,
            title: responseData.post.title,
            content: responseData.post.content
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: null
          });
        });
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create'){
      const post: Post = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content,

      }
      this.postsService.addPost(post);
    }else{
      const post: Post = {
        id: this.postId,
        title: this.form.value.title,
        content: this.form.value.content
      }
      this.postsService.updatePost(post);
    }
    this.form.reset();
  }
}
