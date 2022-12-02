import { Component, OnInit } from '@angular/core';
import {TasksService} from "../../services/tasks.service";
import {Tasks} from "../../interfaces/task.interface";
import {FilterTaskComponent} from "../filter-task/filter-task.component";
import {UtilitiesService} from "../../services/utilities.service";


@Component({
  selector: 'app-display-task',
  templateUrl: './display-task.component.html',
  styleUrls: ['./display-task.component.scss']
  })
export class DisplayTaskComponent implements OnInit {

  public toDoArray: Tasks[] = [];
  public toDoFilterArray: Tasks[] | null = null ;

  constructor(private _service: TasksService, private _utilities: UtilitiesService) {

  }


  ngOnInit(): void {

    this._service.task$.subscribe((task) => {
      console.log(task, " НАШ");
      this.toDoArray = task;
      this.sortDateOldNew()
      this.sortDateNewOld();
      this.sortPriorityNo();

    });

    this._service.filterTask$.subscribe((task) => {
      console.log(task, " фильтр");
      this.toDoFilterArray = task;
      this.sortDateOldNew()
      this.sortDateNewOld();
      this.sortPriorityNo();

    });

  }

  public deleteTask(task: Tasks): void {
    this._service.deleteTask(task);
  }

  public changeColor(task: Tasks, typeId: string): void {
    console.log(typeId, " 'typeId в display-task.component'")
    this._service.changeColor(task, typeId);
   // console.log(this.toDoArray, 'строка 36') //в данном случае мы получаем tаsk как объект
    this.sortDateNewOld()
    this.sortPriorityNo() //сортировка блоков по цвету
  }


  public sortPriorityNo(): void { //ФУНКЦИЯ НА СЛУЧАЙ ОТСУТСТВИЯ СОРТИРОВКИ ПО ПРИОРИТЕТУ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК

    this._utilities.sortPriorityNos(this.toDoArray);

  }

  public sortDateNewOld(): void { //СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ НОВЫХ К СТАРЫМ

    this._utilities.sortDateNewOlds(this.toDoArray);

  }

  public sortDateOldNew(): void {

    this._utilities.sortDateOldNews(this.toDoArray);

  }
}
