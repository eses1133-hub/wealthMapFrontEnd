import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

// 上面區塊 使用來告訴系統這支檔案是大家共用的
// 因為上面這區塊 在我的專案一開始執行的時候就會把這支檔案執行放在後台


export class ExampleService {
  // 設定service欲傳輸的全域變數
  sendData!: string;
  userName!: string;
  userEmail!: string;
  userAge!: number;

  //to-do Add
  // inputNewItem!: Array<string> ;
  inputNewItem: Array<any> = [
    {
      id:"test",
      state:"incomplete",
      startDate:"26/1/12, 13:48"
    },
    {
      id:"test1",
      state:"incomplete",
      startDate:"26/1/12, 13:49"
    }];
  editItem!:Array<any>;

  //weather selected
  dataInfo!:Array<any>;
  selectedConent!:string;


  constructor() { }
}
