import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  imports: [],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

  constructor(
    private router: Router
  ){}
  // 三種身分 visitor;user;admin
  role :string = "admin";
  userName:string="Admin";

  //系統通知
  systemList = [
    { tag: '功能', title: '【新功能】全台首創「資產再平衡」建議系統正式上線！', date: '2026-03-19' },
    { tag: '維護', title: '【預告】本週六凌晨 02:00 系統維護，屆時暫停服務本週六凌晨 02:00 系統維護，屆時暫停服務本週六凌晨 02:00 系統維護，屆時暫停服務', date: '2026-03-18' },
    { tag: '公告', title: '【提醒】保障資產安全，建議每三個月定期更換登入密碼', date: '2026-03-15' },
    { tag: '教學', title: '【攻略】如何設定您的第一個「財務目標」？三分鐘上手教學', date: '2026-03-12' }
  ];


  setAboutUs(){
    console.log("AboutUs");
    this.router.navigate(['/admin-information-set']);
  }

  setNotification(){
    console.log("Notify");
    this.router.navigate(['/admin-notificaton-set']);
  }

  setService(){
    console.log("Term of Service");
    this.router.navigate(['/admin-service-set']);
  }

  setPrivacyPolicy(){
    console.log("Privacy Policy");
    this.router.navigate(['/admin-privacy-set']);
  }
}
