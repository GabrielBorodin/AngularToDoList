import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AddTaskComponent } from './entities/components/add-task/add-task.component';
import {FilterTaskComponent} from './entities/components/filter-task/filter-task.component';
import { DisplayTaskComponent } from './entities/components/display-task/display-task.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {SearchPipe} from "./entities/components/filter-task/search.pipe";

@NgModule({
  declarations: [
    AppComponent,
    AddTaskComponent,
    FilterTaskComponent,
    DisplayTaskComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
