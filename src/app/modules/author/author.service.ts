import { Injectable } from '@angular/core';
import { BaseService } from "src/app/core/service/base.service";
import { Author } from "src/app/data/schema/author";

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService<Author> {

  protected getUrlBase(): string {
    return 'author';
  }
}
