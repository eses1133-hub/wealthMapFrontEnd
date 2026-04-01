import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Asset {
  symbol: string;
  name: string;
  currentPrice: number;
  sharesOwned: number;
  targetPercentage: number;
  currentPercentage?: number; // 新增：當前比例
  suggestion?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  newAsset: Asset = { symbol: '', name: '', currentPrice: 0, sharesOwned: 0, targetPercentage: 0 };
  assets: Asset[] = [];
  filteredStocks: any[] = [];
  totalMarketValue: number = 0;

  constructor(private http: HttpClient) {}

  // 搜尋股票 (打 23 跑出選單)
  onSymbolInput() {
    const query = this.newAsset.symbol;
    if (query && query.length >= 2) {
      this.http.get<any[]>(`http://localhost:8080/api/search?q=${query}`)
        .subscribe({
          next: (data) => this.filteredStocks = data,
          error: (err) => console.error('搜尋失敗', err)
        });
    } else {
      this.filteredStocks = [];
    }
  }

  selectStock(stock: any) {
    this.newAsset.symbol = stock.symbol;
    this.newAsset.name = stock.name;
    this.filteredStocks = [];
  }

  addAsset() {
    if (this.newAsset.symbol && this.newAsset.name) {
      this.assets.push({ ...this.newAsset });
      this.newAsset = { symbol: '', name: '', currentPrice: 0, sharesOwned: 0, targetPercentage: 0 };
    }
  }

  // 核心計算邏輯
  calculateRebalance() {
    // 1. 先算總市值
    this.totalMarketValue = this.assets.reduce((sum, asset) =>
      sum + (asset.currentPrice * asset.sharesOwned), 0);

    // 2. 算每一檔的當前比例與建議
    this.assets.forEach(asset => {
      const currentValue = asset.currentPrice * asset.sharesOwned;

      // 當前比例計算
      asset.currentPercentage = this.totalMarketValue > 0
        ? (currentValue / this.totalMarketValue) * 100
        : 0;

      // 試算建議
      const targetValue = this.totalMarketValue * (asset.targetPercentage / 100);
      const diff = targetValue - currentValue;
      const sharesToAdjust = Math.round(diff / asset.currentPrice);

      if (sharesToAdjust > 0) {
        asset.suggestion = `建議買入 ${sharesToAdjust} 股`;
      } else if (sharesToAdjust < 0) {
        asset.suggestion = `建議賣出 ${Math.abs(sharesToAdjust)} 股`;
      } else {
        asset.suggestion = `比例正確`;
      }
    });
  }
}
