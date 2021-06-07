import { Component, OnInit } from '@angular/core';
import { PostService } from './modules/post/post.service';
import { AuthorService } from './modules/author/author.service';
import { Post } from "./data/schema/post";
import { Author } from './data/schema/author';
import { PostAddComponent } from "./modules/post/post-add/post-add.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'rindus-frontend';

  postList: Post[] = [];
  authorList: Author[] = [];

  constructor(
    private _postService: PostService,
    private _authorService: AuthorService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._postService.get().subscribe( resp => this.postList = resp );
    this._authorService.get().subscribe( resp => this.authorList = resp );
  }

  openDialogPost(): void {
    const dialogRef = this.dialog.open(PostAddComponent, {
      width: '500px',
      height: 'auto',
      data: { 
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._postService.post(result.data).subscribe( response => { if(response) this.postList.push(result.data) });
    });
  }

}
