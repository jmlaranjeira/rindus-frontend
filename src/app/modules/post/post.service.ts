import { Injectable } from '@angular/core';
import { BaseService } from "src/app/core/service/base.service";
import { Post } from "src/app/data/schema/post";

@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseService<Post> {

  protected getUrlBase(): string {
    return 'post';
  }
}
