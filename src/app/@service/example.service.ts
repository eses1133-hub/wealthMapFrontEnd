import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginResponseDTO } from '../@interface/wealth-map';

@Injectable({
  providedIn: 'root'
})

// 上面區塊 使用來告訴系統這支檔案是大家共用的
// 因為上面這區塊 在我的專案一開始執行的時候就會把這支檔案執行放在後台


export class ExampleService {
  constructor() { }
  //  role:string = 'visitor'; 預設值設定為 'visitor'
  private roleSource = new BehaviorSubject<string>('visitor');

  // 💡 2. 暴露一個 Observable 讓所有組件監聽
  role$ = this.roleSource.asObservable();

  // 💡 3. 登入成功時呼叫此方法
  setRole(newRole: string) {
    this.roleSource.next(newRole);
  }

  // 獲取目前數值 (同步)
  get currentRole() {
    return this.roleSource.value;
  }

  // 1. 建立一個包含完整資訊的 Subject，預設值為 null (代表未登入)
  private userSource = new BehaviorSubject<LoginResponseDTO | null>(null);

  // 2. 暴露 Observable 讓元件監聽
  user$ = this.userSource.asObservable();

  // 💡 登入成功時，直接把後端回傳的 DTO 塞進來
  setUserData(userData: LoginResponseDTO) {
    this.userSource.next(userData);
    // 同步把 token 存入 localStorage，這樣之後發送 API 才能帶上它
    localStorage.setItem('token', userData.token);
  }

  // 💡 登出時清空
  clearUserData() {
    this.userSource.next(null);
    localStorage.removeItem('token');
  }

  // 獲取目前數值的快照 (Snapshot)
  get currentUser() {
    return this.userSource.value;
  }

  // 如果你還是想要單獨監聽 Role (例如為了 Navbar 判斷)
  // 可以利用 RxJS 的 map 操作符從 user$ 衍生出來，不需要另外寫 Subject
}
