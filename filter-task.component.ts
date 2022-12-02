import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import {Tasks} from "../../interfaces/task.interface";
import {FormControl, FormGroup, FormArray, FormBuilder, Validators, FormsModule} from "@angular/forms";
import {IdNameInterface} from "../../interfaces/id-name.interface";
import { SearchPipe } from './search.pipe';
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";
import {TasksService} from "../../services/tasks.service";
import {UtilitiesService} from "../../services/utilities.service";


@Component({
  selector: 'app-filter-task',
  templateUrl: './filter-task.component.html',
  styleUrls: ['./filter-task.component.scss'],

})


export class FilterTaskComponent implements OnInit {

  public testForm: FormGroup;
  public form1: FormGroup; // для чекбокса


  public toDoArray: Tasks[] = []; //  Общий массив заявок
  public toDoFilterArray: Tasks[] = []; //  Общий фильтрованный массив
  public filterString: string = ''; //  Введённый текст в строку динамического поиска
  public filterArray: Tasks[] = []; //  Массив с задачами, оставшимися после применения динамического поиска
  public filterPriority: Tasks[] = []; // Массив выбранного фильтра по приоритету
  public checkArrays: Tasks[] = []; //  Массив вывода чекбоксов в зависимости от статуса


  public dates: IdNameInterface[] = [ //  Сортировка по дате
    {id: 1, name: 'Нет'},
    {id: 2, name: 'От новых к старым'},
    {id: 3, name: 'От старых к новым'}
  ];

  public fPriorities: IdNameInterface[] = [ //  Фильтр по приоритету
    {id: 1, name: 'Любой'},
    {id: 2, name: 'Высокий'},
    {id: 3, name: 'Средний'},
    {id: 4, name: 'Низкий'}
  ];

  public sPriorities: IdNameInterface[] = [ //  Сортировка по приоритету
    {id: 1, name: 'Нет'},
    {id: 2, name: 'Приоритет UP'},
    {id: 3, name: 'Приоритет DOWN'}
  ];

  public Data: IdNameInterface[] = [  //  Фильтр по статусу
    {id: 2, name: 'Активные', value: 1},
    {id: 1, name: 'Отменённые', value: 2},
    {id: 3, name: 'Завершёные', value: 3}
  ];


  public form = new FormGroup({ //  Записываем ранее созданный Interface в FormGroup
    date: new FormControl(this.dates[0]),
    fPriority: new FormControl(this.fPriorities[0]),
    sPriority: new FormControl(this.sPriorities[0]),
    data: new FormControl(this.Data[0]),
    findTasks: new FormControl(this.toDoArray),
  });

  constructor(private fb: FormBuilder, private formBuilder: FormBuilder, private _service: TasksService, private _utilities: UtilitiesService) {
    //  При помощи конструктора ссылаемся на export Class из других файлов TS, тем самым делая функции оттуда доступными здесь
    this.form1 = this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
    });
    this.testForm = this.formBuilder.group({
      checkArray: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void { //вывод-проверка наличия значений, поступающих из выпадающих списокв

    this.filterDate(); // Сортирует даты от новых к старым и блоки по цвету
    this.sortPriority(); // Сортирует блоки по приоритету при вызове функции
    this.form.get('findTasks')?.valueChanges.subscribe((data) => {
      console.log(data, ' тот самый findTask');
    });

    this.testForm = this.formBuilder.group({ // для динамический поиск задачи по тексту
      enteredText: ''
    });
    this.onValueChanges();  //  динамический поиск задачи по тексту
    this.filterPrioritys(); // ФИЛЬТР ПО ПРИОРИТЕТУ, КОТОРЫЙ ПОЛУЧАЕТ id ВЫБРАННОГО ЭЛЕМЕНТА И ОТПРАВЛЯЕТ В filterPriorityAll
    this._service.task$.subscribe((task) => { //получили массив задач для фильтра через строку ввода
      this.toDoArray = task;
    });
    console.log(this.filterString, ' filteredString');
  }

  onCheckboxChange(e: any) { // Функция с заполнением массива значений  чекбоксов
    let checkArray: FormArray = this.form1.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i); //  добавляет в массив номеров значение id нажатого чекбокса
          return;
        }
        i++;
      });
    }

  //  checkArray.value - Массив фильтра по статусу, состоящий из id фильтра по статусу

    this.checkArrays = (checkArray.value.map(((s: string) => +s))).map((i: number) => (this.toDoArray.filter(item => item.status === i))).flat();

    // @ts-ignore
    this.checkArrays = this.checkArrays.sort((a, b) => a.status > b.status ? -1 : 1); //  Сортирует блоки по цвету
    console.log(this.checkArrays, ' 118');
    if (this.checkArrays.length === 0) {  //  Если отжаты чекбоксы
      this._service.setArray(this.toDoArray); //  отправляем в сервис общий массив
    } else {
      this._service.setArray(this.checkArrays); //  Иначе отправляем в сервис наш сортированный по цвету и статусу
    }
  }


  onValueChanges(): void { //динамический поиск задачи по тексту
    this.testForm.valueChanges.subscribe(val => {
      this.filterString = val.enteredText.toString().toLowerCase(); //  filterString - введённая ранее строка, с методом toLowerCase
      console.log(this.filterString, ' filteredString');

      this.filterArray = this.toDoArray.filter(plan => { // filterArray - отфильтрованный массив, получивший в себя только значения, совпадающие с введённым
        return plan.text.toLowerCase().includes(this.filterString.toLowerCase()); //  Возвращает все элементы массива, где встречается введённый текст
      });

      if (!this.filterString) { //  Еслт введённая строка пустая
        this._service.setArray(this.toDoArray); //  отправляем в сервис общий массив
      } else {
        this._service.setArray(this.filterArray); //  Иначе отправляем в сервис отфильтрованный массив с совпадением введённого текста
      }
    });
  }

  public filterDate(): void { //  Общая функция сортировки по дате
    this.form.get('date')?.valueChanges.subscribe((data) => {
        // @ts-ignore
        console.log(data.id, ' id даты') // Получаем ID выбранного элемента выпадающего списка и в зависимости от него вызываем различные функции
        // @ts-ignore
        if (data.id === 2) {
          this.sortDateNewOld(); // СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ НОВЫХ К СТАРЫМ
          // @ts-ignore
        } else if (data.id === 3) {
          this.sortDateOldNew(); // СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ СТАРЫХ К НОВЫМ
        } else {
          this.sortPriorityNo(); // Сортировка по дате отсутствует, сортирует дату от новых к старым и блоки по цвету
        }
      }
    )
  }

  public sortDateNewOld(): void { //СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ НОВЫХ К СТАРЫМ
    this._utilities.sortDateNewOlds(this.toDoArray);
  }

  public sortDateOldNew(): void { //СОРТИРОВКА ДАТЫ СОЗДАНИЯ ОТ НОВЫХ К СТАРЫМ
    this._utilities.sortDateOldNews(this.toDoArray);
  }

  public sortPriorityNo(): void { //ФУНКЦИЯ НА СЛУЧАЙ ОТСУТСТВИЯ СОРТИРОВКИ ПО ПРИОРИТЕТУ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
    this._utilities.sortPriorityNos(this.toDoArray);
  }

  public sortPriority(): void { //ОБЩАЯ ФУНКЦИЯ СОРТИРОВКИ ПО ПРИОРИТЕТУ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
    this.form.get('sPriority')?.valueChanges.subscribe((data: IdNameInterface | null) => {

      if (data?.id === 2) { // Получаем ID выбранного элемента выпадающего списка и в зависимости от него вызываем различные функции
        this.sortPriorityUp(); //СОРТИРОВКА ПРИОРИТЕТА ПО УБЫВАНИЮ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
      } else if (data?.id === 1) {
        this.sortPriorityNo();  //ФУНКЦИЯ НА СЛУЧАЙ ОТСУТСТВИЯ СОРТИРОВКИ ПО ПРИОРИТЕТУ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
      } else {
        this.sortPriorityDown(); //СОРТИРОВКА ПРИОРИТЕТА ПО ВОЗРАСТАНИЮ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
      }
    });
  }

  public sortPriorityUp(): void { //  СОРТИРОВКА ПРИОРИТЕТА ПО УБЫВАНИЮ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
    this._utilities.sortPriorityUps(this.toDoArray);
  }

  public sortPriorityDown(): void { //  СОРТИРОВКА ПРИОРИТЕТА ПО ВОЗРАСТАНИЮ ЧЕРЕЗ ВЫПАДАЮЩИЙ СПИСОК
    this._utilities.sortPriorityDowns(this.toDoArray);
  }


  public filterPrioritys(): void { // ФИЛЬТР ПО ПРИОРИТЕТУ, КОТОРЫЙ ПОЛУЧАЕТ id ВЫБРАННОГО ЭЛЕМЕНТА И ОТПРАВЛЯЕТ В filterPriorityAll С ОПРЕДЕЛЁННЫМ ID
    this.form.get('fPriority')?.valueChanges.subscribe((data) => {
      // @ts-ignore
      switch (data.id) {

        case 2:

          this.filterPriority = [];
          this.filterArray = [];
          this.filterPriorityAll(2);
          break;

        case 3:
          this.filterPriority = [];
          this.filterArray = [];
          this.filterPriorityAll(3);
          break;

        case 4:
          this.filterPriority = [];
          this.filterArray = [];
          this.filterPriorityAll(4);
          break;

        default:
          this.filterPriority = [];
          this.filterPriorityAll(1);
      }
    });
  }

  public filterPriorityAll(typePriority: number): void { // В ЗАВИСИМОСТИ ОТ ПОЛУЧЕННОГО ID ВОЗВРАЩАЕТ МАССИВЫ С РАЗЛИЧНЫМ ПРИОРИТЕТОМ

    switch (typePriority) { //  Фильтруем массив для получения элементов только с определённым приоритетом

      case 2:

        this.filterPriority = this.toDoArray.filter(function (item) {
          return item.priority === 1;
        })
        this._service.setArray(this.filterPriority);  //  Отправляем в сервис отсортированный массив
        break;

      case 3:

        this.filterPriority = this.toDoArray.filter(function (item) {
          return item.priority === 2;
        })
        this._service.setArray(this.filterPriority);
        break;

      case 4:

        this.filterPriority = this.toDoArray.filter(function (item) {
          return item.priority === 3;
        })
        this._service.setArray(this.filterPriority);
        break;

      default:

        this._service.setArray(this.toDoArray); //  Если фильтр по приоритету любой, то выводим общий массив
    }
  }
}








