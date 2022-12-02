import {Injectable} from "@angular/core";
import {Tasks} from "../interfaces/task.interface";

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  public sortDateNewOlds(task: Tasks[]): void { //СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ НОВЫХ К СТАРЫМ

    task.sort(function (a, b) {
      if (a.time > b.time) {
        return -1;
      } else if (a.time < b.time) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  public sortPriorityNos(task: Tasks[]): void { //ФУНКЦИЯ НА СЛУЧАЙ ОТСУТСТВИЯ СОРТИРОВКИ ПО ПРИОРИТЕТУ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
    this.sortDateNewOlds(task);
    task.sort((a, b) => {
        if (a.status > b.status) {
          return -1;
        } else {
          return 1;
        }
      }
    )
  }

  public sortDateOldNews(task: Tasks[]): void { //СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ СТАРЫХ К НОВЫМ

    task.sort(function (a, b) {
      if (a.time > b.time) {
        return 1;
      } else if (a.time < b.time) {
        return -1;
      } else {
        return 0;
      }
    })
  }

  public sortPriorityUps(task: Tasks[]): void {
    task.sort(function (a, b) {
      if (a.priority > b.priority) {
        return 1;
      } else if (a.priority < b.priority) {
        return -1;
      } else {
        return 0;
      }
    })
  }

  public sortPriorityDowns(task: Tasks[]): void {
    task.sort(function (a, b) {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority < b.priority) {
        return 1;
      } else {
        return 0;
      }
    })
  }


}
