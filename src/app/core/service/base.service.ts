import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment.prod';
import { Observable, Subject } from "rxjs";
import Swal from "sweetalert2";

export enum Operation {
  add = 'add',
  save = 'save',
  find = 'find',
  delete = 'delete',
  detail = 'detail',
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<D> {

  private saved$: Subject<boolean> = new Subject();
  private deleted$: Subject<boolean> = new Subject();

  protected constructor(protected http: HttpClient) {}

  protected abstract getUrlBase(): string;

  get(): Observable<any> { 
    return this.http.get<any>(environment.rootUrl + this.getUrlBase());
  }

  post( form: D ) {

    if(this.saved$.isStopped){
      this.saved$ = new Subject<boolean>();
    }

    this.http.post<D>(environment.rootUrl + this.getUrlBase(), form)
      .subscribe( response => {
        Swal.fire("Successful operation", "", 'success');
        this.saved$.next(true);
        this.saved$.complete();
      }, (err) => {
        if(err.error.errors !== undefined) {
          let errors = err.error.errors.map(error => error.msg);
          Swal.fire('Error', JSON.stringify(errors), 'error' );
        } else {
          Swal.fire('Error', err.error.msg, 'error' );
        }
        
        this.saved$.next(false);
        this.saved$.complete();
      });

    return this.saved$.asObservable();
  }

  put( form: any ) {

    if(this.saved$.isStopped){
      this.saved$ = new Subject<boolean>();
    }

    this.http.put<D>(environment.rootUrl + this.getUrlBase() + `/${ form.id }`, form)
      .subscribe( response => {
        Swal.fire("Successful operation", "", 'success');
        this.saved$.next(true);
        this.saved$.complete();
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error' );
        this.saved$.next(false);
        this.saved$.complete();
      });

    return this.saved$.asObservable();
  }

  delete( id: string ) {

    if(this.deleted$.isStopped){
      this.deleted$ = new Subject<boolean>();
    }

    this.http.delete<D>(environment.rootUrl + this.getUrlBase() + `/${ id }`)
      .subscribe( response => {
        if(response) {
          this.deleted$.next(true);
          this.deleted$.complete();
          Swal.fire(
            "Deleted!",
            "",
            'success'
          );
        }
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error' );
        this.deleted$.next(false);
        this.deleted$.complete();
      });

    return this.deleted$.asObservable();
  }

}
