import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tasks} from "./entities/interfaces/task.interface";


@Injectable()
export class HttpService{

  constructor(private http: HttpClient){ }

  postData(user: Tasks){

    console.log("Отправлено ");
    return this.http.post('http://localhost:4200/', user);
  }
}

