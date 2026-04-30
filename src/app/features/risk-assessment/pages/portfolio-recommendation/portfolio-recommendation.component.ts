import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-portfolio-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss']
})
export class PortfolioRecommendationComponent implements OnInit {

  userLevel: string = '';
  recommendedList: any[] = [];
  isLoading: boolean = false;


  portfolioDatabase: any = {
    '保守型': [
      { ticker: '00679B', name: '元大美債20年', type: '債券', allocation: '40%', reason: '避險首選，提供最高防禦力與穩定利息' },
      { ticker: '00720B', name: '元大投資級公司債', type: '債券', allocation: '30%', reason: '收益率優於公債，信用風險極低' },
      { ticker: '00933B', name: '國泰10Y+金融債', type: '債券', allocation: '15%', reason: '鎖定全球大型銀行，具備低違約率特性' },
      { ticker: '00713', name: '元大台灣高息低波', type: '股票', allocation: '15%', reason: '具備低波動抗跌特性，提供基礎股息' }
    ],
    '穩健型': [
      { ticker: '00878', name: '國泰永續高股息', type: '股票', allocation: '30%', reason: '台灣熱門高股息，走勢相對大盤平穩' },
      { ticker: '00919', name: '群益台灣精選高息', type: '股票', allocation: '20%', reason: '精準卡位高息股，提升整體現金流' },
      { ticker: '00679B', name: '元大美債20年', type: '債券', allocation: '25%', reason: '平衡股市波動風險，作為防禦部位' },
      { ticker: '00725B', name: '國泰投資級公司債', type: '債券', allocation: '25%', reason: '穩定配息，兼顧收益與資產安全' }
    ],
    '平衡型': [
      { ticker: '006208', name: '富邦台50', type: '股票', allocation: '25%', reason: '內扣費用低的台股大盤，跟隨台灣經濟成長' },
      { ticker: '00878', name: '國泰永續高股息', type: '股票', allocation: '25%', reason: '老牌穩健高息，創造高殖利率現金流' },
      { ticker: '00679B', name: '元大美債20年', type: '債券', allocation: '25%', reason: '美國政府公債，大幅降低投資組合波動' },
      { ticker: '00720B', name: '元大投資級公司債', type: '債券', allocation: '25%', reason: '優質大型企業債券，提供穩定固定收益' }
    ],
    '成長型': [
      { ticker: '0050', name: '元大台灣50', type: '股票', allocation: '40%', reason: '囊括全台前50大企業，作為長期成長核心' },
      { ticker: '00881', name: '國泰台灣5G+', type: '股票', allocation: '20%', reason: '專注半導體與科技產業，具備較高爆發力' },
      { ticker: '00662', name: '富邦NASDAQ', type: '股票', allocation: '20%', reason: '跨足美國科技巨頭，參與全球創新成長' },
      { ticker: '00679B', name: '元大美債20年', type: '債券', allocation: '20%', reason: '保留少部分避險部位，對抗極端股災' }
    ],
    '積極型': [
      { ticker: '0050', name: '元大台灣50', type: '股票', allocation: '40%', reason: '緊貼台股大盤，掌握權值股強勁動能' },
      { ticker: '0052', name: '富邦科技', type: '股票', allocation: '30%', reason: '重壓台積電與科技股，追求超額報酬' },
      { ticker: '00830', name: '國泰費城半導體', type: '股票', allocation: '15%', reason: '投資全球頂尖半導體，捕捉最強爆發力' },
      { ticker: '00733', name: '富邦台灣中小', type: '股票', allocation: '15%', reason: '捕捉中小型股爆發行情，拉高整體利潤' }
    ]
  };

  constructor(
    private router: Router,
    private location: Location
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['level']) {
      this.userLevel = navigation.extras.state['level'];
    }
  }

  ngOnInit(): void {
    // 🌟 直接從前端資料庫抓對應的推薦清單！
    this.recommendedList = this.portfolioDatabase[this.userLevel] || [];
  }

  goToAssets() { this.router.navigate(['/assets']); }
  backToHome() { this.router.navigate(['/main']); }
  backToResult() { this.location.back(); }
}