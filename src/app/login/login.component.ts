import { Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from '@angular/forms';
import { WealthService } from '../wealthservice.service';
import { HttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FormsModule,RouterLink,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;

  emailErrorMsg = '';
  passwordErrorMsg = '';

  constructor(private router:Router,){
  }


togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validate(field: 'email' | 'password'): void {
  const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (field === 'email') {
    if (!this.email) {
      this.emailErrorMsg = '電子郵件不能為空';
    } else if (!emailRule.test(this.email)) {
      this.emailErrorMsg = 'Email 格式不正確';
    } else {
      this.emailErrorMsg = ''; // 格式正確就清空訊息
    }
  }

  if (field === 'password') {
    if (!this.password) {
      this.passwordErrorMsg = '請輸入密碼';
    } else if (this.password.length < 8 || this.password.length > 12) {
      this.passwordErrorMsg = '密碼長度須為 8-12 位';
    } else {
      this.passwordErrorMsg = '';
    }
  }
}

  login(): void {
   // 1. 手動觸發兩次驗證，確保按下登入時，兩個錯誤訊息都會更新
  this.validate('email');
  this.validate('password');

  // 2. 最終檢查：只要兩個錯誤訊息都是空的，就代表格式全部正確
  if (!this.emailErrorMsg && !this.passwordErrorMsg) {
    console.log('格式正確，執行登入 API');

    // 這裡放原本被註解掉的 Service 呼叫邏輯
    // const loginData = { email: this.email, password: this.password };
    // this.wealthService.login(loginData).subscribe(...)
  }
}



  // login() {
  //   const loginData = {
  //     email: this.email,
  //     password: this.password
  //   };

  //   this.wealthService.login(loginData).subscribe({
  //     next: (res) => {
  //       console.log('登入成功', res);
  //       this.router.navigate(['/first']);
  //     },
  //     error: (err) => {
  //       console.error('登入失敗', err);
  //       alert('帳號或密碼錯誤');
  //     }
  //   });
  // }
}
