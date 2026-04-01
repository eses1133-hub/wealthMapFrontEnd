import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // 1. 這裡一定要有這行，HTML 的紅字才會消失
  targetTotalValue: number = 1000000;

  portfolio = [
    { symbol: '2330', name: '台積電', currentPrice: 600, sharesOwned: 1000, targetPercentage: 0.5 },
    { symbol: '0050', name: '元大台灣50', currentPrice: 150, sharesOwned: 2000, targetPercentage: 0.5 }
  ];

  results: any[] = [];

  constructor(private http: HttpClient) {
    this.results = [...this.portfolio];
  }

  // 2. 這裡一定要有這個 function，按鈕的紅字才會消失
  onCalculate() {
    const url = 'http://localhost:8080/api/calculate';
    const payload = {
      portfolio: this.portfolio,
      targetTotalValue: this.targetTotalValue
    };

    this.http.post<any[]>(url, payload).subscribe({
      next: (data) => {
        this.results = data;
        console.log('連線成功！', data);
      },
      error: (err) => alert('連線失敗！請檢查 Java 是否啟動。')
    });
  }
}
