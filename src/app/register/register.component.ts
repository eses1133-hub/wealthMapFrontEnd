import { Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from '@angular/forms';
import { WealthService } from '../wealthservice.service';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [HeaderComponent, FormsModule, RouterLink,MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  showPassword = false;

  emailErrorMsg = '';
  passwordErrorMsg = '';
  nameErrorMsg = '';

  constructor(
    private router: Router,
    // private wealthService:WealthService,
    // private http: HttpClient
  ) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  // get isNameInvalid(): boolean {
  //   return this.name.length > 0;//可增加字數限制
  // }
  // get isEmailInvalid(): boolean {
  //   const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  //   return this.email.length > 0 && !emailRule.test(this.email);
  // }
  // get isPasswordLengthInvalid(): boolean {
  //   const passRule = /^[a-zA-Z0-9]{8,12}$/;
  //   return this.password.length > 0;
  // }

  validate(field: 'name' | 'email' | 'password'): void {
    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (field === 'name') {
      if (!this.name) {
        this.nameErrorMsg = '姓名不能為空';
      } else {
        this.nameErrorMsg = ''; // 格式正確就清空訊息
      }
    }

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

  register() {
    this.validate('name');
    this.validate('email');
    this.validate('password');

    // 2. 最終檢查：只要兩個錯誤訊息都是空的，就代表格式全部正確
    if (!this.nameErrorMsg && !this.emailErrorMsg && !this.passwordErrorMsg) {
      console.log('格式正確，執行登入 API');

      // 這裡放原本被註解掉的 Service 呼叫邏輯
      // const loginData = { email: this.email, password: this.password };
      // this.wealthService.login(loginData).subscribe(...)
    }
  }

  // register(){
  //   const registerData = {
  //     name: this.name,
  //     email: this.email,
  //     password: this.password
  //   };

  //   this.wealthService.createUser(registerData).subscribe({
  //     next: (res) => {
  //       console.log('註冊成功', res);
  //       alert('註冊成功！');
  //       this.router.navigate(['/login']);
  //     },
  //     error: (err) => {
  //       console.error('註冊失敗', err);
  //       alert('註冊發生錯誤');
  //     }
  //   });
  // }
}
