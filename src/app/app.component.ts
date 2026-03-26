import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'wealthMap';

  constructor (private router:Router){}

  login(){
    this.router.navigate(['/login']);
  }
  register(){
    this.router.navigate(['/register']);
  }

  setAboutUs() {
    console.log("AboutUs");
    this.router.navigate(['/admin-information-set']);
  }

  setService() {
    console.log("Term of Service");
    this.router.navigate(['/admin-service-set']);
  }

  setPrivacyPolicy() {
    console.log("Privacy Policy");
    this.router.navigate(['/admin-privacy-set']);
  }

  ngOnInit() {

    // 💡 監聽所有的路由事件 -> 讓footer的按鈕按了以後可以跳回頁面的最上面
    this.router.events.pipe(
      // 只過濾出「導航結束 (NavigationEnd)」的事件
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // 🚀 只要導航結束，就立刻跳回最頂端
      window.scrollTo(0, 0);
      // 或者如果你想要平滑一點的滾動效果：
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}
