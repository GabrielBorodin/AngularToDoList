import { Component, OnInit } from '@angular/core';
import {TasksService} from "../../services/tasks.service";
import {Tasks} from "../../interfaces/task.interface";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
tasksArray: Tasks[] = [];
public value: string = '';
public priority: string = '';

  constructor(private _service: TasksService) {

  }

  ngOnInit(): void {
    this._service.getTask();
  }


  public sendNewObjective(): void {
    console.log(this.value);
    console.log(this.priority+" приоритет");

    if (!this.value) {
         alert("Текст задачи не введён");
       }
    else{
    if (!this.priority) {
      alert("Выберите приоритет задачи");
    }
    else{
    const object: Tasks = {
      text: this.value,
      time: new Date().toLocaleString(),
      status: 2,
      priority: this.priority === 'Высокий' ? 1 : this.priority === 'Низкий' ? 3 : 2,
    };

    console.log(object);
    this.tasksArray.push(object);
      this._service.addTask(object);
      this._service.getTask();
    console.log(this.tasksArray);
    this.value = '';
    this.priority = '';
  }}
}}


