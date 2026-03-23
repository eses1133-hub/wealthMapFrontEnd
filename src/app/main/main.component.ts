import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-main',
  imports: [RouterLink, MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  role: string = "user";
  constructor(private router: Router) { }

  // 個人通知
  personalList = [
    { tag: '繳款提醒', title: '您的房屋貸款即將於 3 日後扣款，請確認帳戶餘額。', date: '2026-03-22' },
    { tag: '定期定額', title: '本月美股 ETF 投資已扣款成功，點擊查看成交明細。', date: '2026-03-18' },
    { tag: '目標到期', title: '您的「緊急預備金存滿計劃」今日到期，請檢視資產配置。您的「緊急預備金存滿計劃」今日到期，請檢視資產配置。您的「緊急預備金存滿計劃」今日到期，請檢視資產配置。您的「緊急預備金存滿計劃」今日到期，請檢視資產配置。', date: '2026-03-19' }
  ];

  //系統通知
  systemList = [
    { tag: '功能', title: '【新功能】全台首創「資產再平衡」建議系統正式上線！', date: '2026-03-19' },
    { tag: '維護', title: '【預告】本週六凌晨 02:00 系統維護，屆時暫停服務本週六凌晨 02:00 系統維護，屆時暫停服務本週六凌晨 02:00 系統維護，屆時暫停服務', date: '2026-03-18' },
    { tag: '公告', title: '【提醒】保障資產安全，建議每三個月定期更換登入密碼', date: '2026-03-15' },
    { tag: '教學', title: '【攻略】如何設定您的第一個「財務目標」？三分鐘上手教學', date: '2026-03-12' }
  ];

  currentIndex = 0; // 目前顯示的新聞索引

  ngOnInit() {
    // 每 5 秒自動切換下一則新聞
    setInterval(() => {
      this.nextPersonal();
    }, 8000);
  }

  nextPersonal() {
    this.currentIndex = (this.currentIndex + 1) % this.personalList.length;
  }

  prevPersonal() {
    this.currentIndex = (this.currentIndex - 1 + this.personalList.length) % this.personalList.length;
  }
  login() {
    this.router.navigate(['/login']);
  }


  goToRiskTest() {
    this.router.navigate(['/risk-test']);
  }

  closeNotice() {
    const notice = document.getElementById('notification');
    notice?.remove();
  }

  ngAfterViewInit() {
    let ctx = document.getElementById('chart') as HTMLCanvasElement;

    let data = {
      // x 軸文字
      labels: ['現金', '股票', '基金', '債券'],
      datasets: [
        {
          // 上方分類文字
          // label: '金額',
          // 數據
          data: [1000000, 1350000, 800000, 650000],
          // 線與邊框顏色
          backgroundColor: [
            // '#FFF7AE',
            // '#99B3E4',
            // '#bdffe0',
            // '#fbb6c9',
            '#1368aa',
            '#9dcee2',
            '#fedfd4',
            '#f29479',
          ],

          hoverOffset: 4,
        },
      ],
    };

    // 創建圖表
    let chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 40
        },
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: {
              boxWidth: 40,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgb(255, 255, 255)', // 1. 更改底色
            titleColor: '#333',                      // 2. 標題顏色
            bodyColor: '#666',                       // 3. 內容文字顏色
            cornerRadius: 20,                        // 4. 更改形狀 (圓角設定，數值越大越圓)
            padding: 12,                             // 內距，讓框框看起來不擁擠
            borderColor: '#4091c9',                  // 5. 邊框顏色
            borderWidth: 1,                          // 邊框寬度
            displayColors: false,                     // 是否顯示旁邊的小色塊
            boxPadding: 5,                           // 色塊與文字的距離
            callbacks: {
              // 💡 如果你想要自定義顯示的文字格式（例如加上錢字號）
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': $';
                }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat('zh-TW').format(context.parsed);
                }
                return label;
              }
            }
          },
        }
      }
    });
  }
}