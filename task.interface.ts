export interface Tasks {
  text: string;
  time: string; //Вообще получаем мы её в "Date", но тк мы преобразовали дату в строку при помощи toLocaleString(), то здесь string
  status: number;
  priority: number;
  id?: number; // необязательный объект, который не должен быть всегда
  typeId?: string;
}

