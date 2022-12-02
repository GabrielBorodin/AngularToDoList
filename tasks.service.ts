import { Injectable } from '@angular/core';
import {Tasks} from "../interfaces/task.interface";
import {BehaviorSubject, Observable, observable} from "rxjs";
import {useAnimation} from "@angular/animations";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private _task$$: BehaviorSubject<Tasks[]> = new BehaviorSubject<Tasks[]>([]);
  public task$: Observable<Tasks[]> = this._task$$.asObservable();

  private _filterTask$$: BehaviorSubject<Tasks[] | null> = new BehaviorSubject<Tasks[] | null>(null);
  public filterTask$: Observable<Tasks[] | null> = this._filterTask$$.asObservable();

  constructor(private http: HttpClient) {
  }

  public setArray(array: Tasks[]): void {
    this._filterTask$$.next(array);
  }

  public getTask(): void { //Функция GET
                           // @ts-ignore
    this.http.get(' http://127.0.0.1:3000/items').toPromise().then((data: Tasks[]) => {
      console.log(data, "GET");
      this._task$$.next(data);
    });
  }


  public addTask(task: Tasks): void { //Функция POST

    this.http.post(' http://127.0.0.1:3000/items', task).toPromise().then((data) => {
      console.log(data);
    })
  }

  public deleteTask(task: Tasks): void { //Функция DELETE

    this.http.delete('http://127.0.0.1:3000/items/' + task.id).toPromise().then((data) => {
      console.log(data);
      this.getTask()
    })
  }

  public changeColor(task: Tasks, typeId: string) {

    console.log(task, 'строка 48') //в данном случае мы получаем tаsk как объект
    if (typeId === 'changeColorYes') {
      task.status = 3;
    } else {
      task.status = 1;
    }
    this.http.put('http://127.0.0.1:3000/items/' + task.id, task).toPromise().then((data) => {
      console.log(data);
    });
    console.log(task.status, ' статус в task.service');
  }

}
