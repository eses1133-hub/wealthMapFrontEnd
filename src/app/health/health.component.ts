import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { HealthService } from '../services/health.service';
import { FormsModule } from '@angular/forms';

interface HealthMetric {
  label: string;
  value: string;
  isAlert: boolean;
  status: string;
}

interface MetricsMap {
  [key: string]: HealthMetric;
}

interface HealthResponse {
  L: number;
  DTI: number;
  S: number;
  G: number;
  score: number;
  level?: string;
  advice?: string;
}

interface HistoryItem {
  date: string;
  L: number;
  DTI: number;
  S: number;
  G: number;
  score: number;
}

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, FormsModule],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent implements OnInit {

  constructor(private healthService: HealthService) { }

  form = {
    income: 0,
    expense: 0,
    savings: 0,
    cash: 0,
    mortgage: 0,
    carLoan: 0,
    personalLoan: 0,
    creditCard: 0,
    investmentSuccessRate: 0
  };

  metrics: MetricsMap = {
    liquidity: { label: '', value: '', isAlert: false, status: '' },
    debt: { label: '', value: '', isAlert: false, status: '' },
    savings: { label: '', value: '', isAlert: false, status: '' },
    investment: { label: '', value: '', isAlert: false, status: '' }
  };

  gaugeOption: EChartsOption = {};
  radarOption: EChartsOption = {};
  historyLineOption: EChartsOption = {};

  historyData: HistoryItem[] = [
    { date: '2026-01', L: 6, DTI: 50, S: 70, G: 65, score: 50 },
    { date: '2026-02', L: 7.5, DTI: 60, S: 80, G: 70, score: 65 },
    { date: '2026-03', L: 8.5, DTI: 70, S: 90, G: 80, score: 80 }
  ];

  ngOnInit(): void {
    this.loadHealthData();
  }


  submit(): void {
    this.healthService.postHealth(this.form).subscribe({
      next: (res: HealthResponse) => {
        console.log('後端回來', res);
        this.updateView(res);
      },
      error: (err) => {
        console.error('API 錯誤', err);
      }
    });
  }


private updateView(res: HealthResponse): void {

  this.initGauge(res.score);
  this.initRadar(res.L, res.DTI, res.S, res.G);
  this.initHistoryLine(this.historyData);

  this.metrics = {
    liquidity: {
      label: '流動性',
      value: res.L.toFixed(1),
      isAlert: res.L < 3,
      status: res.L >= 6 ? '良好' : '偏低'
    },
    debt: {
      label: '負債比',
      value: res.DTI.toFixed(1) + '%',
      isAlert: res.DTI > 50,
      status: res.DTI < 50 ? '正常' : '過高'
    },
    savings: {
      label: '儲蓄率',
      value: res.S.toFixed(1) + '%',
      isAlert: res.S < 20,
      status: res.S >= 20 ? '正常' : '偏低'
    },
    investment: {
      label: '投資成功率',
      value: res.G.toFixed(1) + '%',
      isAlert: res.G < 60,
      status: res.G >= 60 ? '良好' : '需改善'
    }
  };
}

  loadHealthData(): void {
    this.healthService.postHealth({
      income: 100000,
      expense: 40000,
      savings: 200000,
      cash: 40000,
      mortgage: 20000,
      carLoan: 5000,
      personalLoan: 0,
      creditCard: 3000,
      investmentSuccessRate: 85
    }).subscribe({
      next: (res: HealthResponse) => {
        console.log('後端回來', res);

        this.initGauge(res.score);
        this.initRadar(res.L, res.DTI, res.S, res.G);
        this.initHistoryLine(this.historyData);

        this.metrics = {
          liquidity: {
            label: '流動性',
            value: res.L.toFixed(1),
            isAlert: res.L < 3,
            status: res.L >= 6 ? '良好' : '偏低'
          },
          debt: {
            label: '負債比',
            value: res.DTI.toFixed(1) + '%',
            isAlert: res.DTI > 50,
            status: res.DTI < 50 ? '正常' : '過高'
          },
          savings: {
            label: '儲蓄率',
            value: res.S.toFixed(1) + '%',
            isAlert: res.S < 20,
            status: res.S >= 20 ? '正常' : '偏低'
          },
          investment: {
            label: '投資成功率',
            value: res.G.toFixed(1) + '%',
            isAlert: res.G < 60,
            status: res.G >= 60 ? '良好' : '需改善'
          }
        };
      },
      error: (err) => {
        console.error('API 錯誤', err);
      }
    });
  }

  initGauge(score: number): void {
    this.gaugeOption = {
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          splitNumber: 5,
          data: [{ value: Math.round(score), name: '健康得分' }],
          axisLine: {
            lineStyle: {
              width: 15,
              color: [
                [0.3, '#ff4d4f'],
                [0.7, '#ffec3d'],
                [1, '#73d13d']
              ]
            }
          },
          detail: {
            formatter: '{value} 分',
            fontSize: 24
          },
          title: {
            fontSize: 16
          }
        }
      ]
    };
  }

  initRadar(L: number, DTI: number, S: number, G: number, date: string = '現在'): void {
    this.radarOption = {
      title: {
        text: `${date} 財務狀況分析`,
        left: 'center',
        textStyle: { fontSize: 14 }
      },
      tooltip: {
        trigger: 'item'
      },
      radar: {
        radius: '60%',
        indicator: [
          { name: '流動性', max: 12 },
          { name: '抗壓性', max: 100 },
          { name: '儲蓄率', max: 100 },
          { name: '投資力', max: 100 }
        ]
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [L, 100 - DTI, S, G],
              areaStyle: { color: 'rgba(115, 209, 61, 0.3)' }
            }
          ]
        }
      ]
    };
  }

  initHistoryLine(data: HistoryItem[]): void {
    if (!data || data.length === 0) {
      return;
    }

    this.historyData = data;

    this.historyLineOption = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['財務總分']
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: this.historyData.map(item => item.date),
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        name: '總分'
      },
      series: [
        {
          name: '財務總分',
          type: 'line',
          data: this.historyData.map(item => item.score),
          smooth: true,
          symbolSize: 10,
          lineStyle: {
            width: 4,
            color: '#5470c6'
          },
          areaStyle: {
            opacity: 0.2
          }
        }
      ]
    };

    const last = this.historyData[this.historyData.length - 1];
    if (last) {
      this.initRadar(last.L, last.DTI, last.S, last.G, last.date);
    }
  }

  onChartClick(params: any): void {
    const index = params?.dataIndex;
    const item = this.historyData[index];

    if (item) {
      this.initRadar(item.L, item.DTI, item.S, item.G, item.date);
    }
  }
}
// rawInfo!: FinancialData;



// constructor(private healthService: HealthService) {}
// 模擬資料

// loadHealthData() {
//   this.healthService.getHealth().subscribe(res => {`
//     console.log("API回來了", res);

//     this.rawInfo = res.rawInfo;
//     this.calculateFinancialHealth();
//   });
// }

// ngOnInit() {
// this.healthService.getHealth().subscribe(res => {

//   this.loadHealthData();

// setInterval(() => {
//   this.loadHealthData();
// }, 3000); // 每3秒更新

//   // 🔥 把後端資料塞進來
//   this.rawInfo = res.rawInfo;

//   // 🔥 用你原本邏輯
//   this.calculateFinancialHealth();

// });
// }

// 計算結果
// metrics: MetricsMap = {
//   liquidity: { label: '', value: '', isAlert: false, status: ''},
//   debt: { label: '', value: '', isAlert: false, status: ''  },
//   savings: { label: '', value: '', isAlert: false, status: '' },
//   investment: { label: '', value: '', isAlert: false, status: '' },
// };

// gaugeOption: EChartsOption = {};
// radarOption: EChartsOption = {};


// 假設這是你的詳細數據
// historyData = [
// { date: '2026-01', L: 6, DTI: 50, S: 70, G: 65,score:50}, // 1月
// { date: '2026-02', L: 7.5, DTI: 60, S: 80, G: 70,score:65}, // 2月
// { date: '2026-03', L: 8.5, DTI: 70, S: 90, G: 80,score:80}  // 3月 (目前)
// ];

// historyLineOption: any;

//   private getScore(L: number, DTI: number, S: number, G: number): number {
//   const hasGoal = G !== null && G !== undefined && G > 0;
//   const baseWeight = hasGoal ? (100 / 3 / 1.2) : (100 / 3);
//   const investWeight = hasGoal ? 20 : 0;

//   const scoreL = Math.min(baseWeight, (L / 6) * baseWeight);
//   const scoreDTI = Math.min(baseWeight, (Math.max(0, 50 - DTI) / 50) * baseWeight);
//   const scoreS = Math.min(baseWeight, (S / 20) * baseWeight);
//   const scoreG = hasGoal ? Math.min(investWeight, (G / 100) * investWeight) : 0;


//   return Math.round(scoreL + scoreDTI + scoreS + scoreG);
// }

//   calculateFinancialHealth() {
//     const d = this.rawInfo;
//     const totalDebt = Object.values(d.debts as Record<string, number>).reduce(
//   (a, b) => a + b,
//   0
// );
//     const L = d.expense > 0 ? (d.assets.savings + d.assets.cash) / d.expense : 0;
//     const DTI = (totalDebt / d.income) * 100;
//     const S = ((d.income - d.expense) / d.income) * 100;
//     const G = d.investmentSuccessRate;

//     const hasGoal = G !== null && G !== undefined && G > 0;

//     let debtStatus = '';
//     if (DTI <= 15) debtStatus = '槓桿極低，財務極其穩健。';
//     else if (DTI <= 30) debtStatus = '槓桿比例健康，具備良好抗風險空間。';
//     else if (DTI <= 45) debtStatus = '負債尚在可控範圍，建議檢視非必要支出。';
//     else debtStatus = '負債壓力沉重，需立即優化債務結構。';

//     let investStatus = '';
//     if (!hasGoal) investStatus = '尚未設定財務目標，建議先建立投資計畫。';
//     else if (G >= 95) investStatus = '即將達成財務自由，建議維持現有配置。';
//     else if (G >= 80) investStatus = '接近財務自由目標，建議逐步增加資產配置。';
//     else if (G >= 60) investStatus = '達成率穩定增長，建議持續投入。';
//     else investStatus = '達成率有待提升，建議重新檢視投資標的。';

//     let liquidStatus = '';
//     if (L >= 12) liquidStatus = '預備金極為充裕，可考慮更積極的資產配置。';
//     else if (L >= 6) liquidStatus = '預備金充足，可支撐長期投資佈局。';
//     else if (L >= 3) liquidStatus = '預備金尚可，足以應付短期突發狀況。';
//     else liquidStatus = '預備金嚴重不足，應暫緩投資並優先儲蓄。';

//     let savingStatus = '';
//     if (S >= 60) savingStatus = '儲蓄力強勁，現金流充裕。';
//     else if (S >= 40) savingStatus = '儲蓄表現優異，資本累積速度理想。';
//     else if (S >= 20) savingStatus = '儲蓄水平正常，建議維持固定撥存習慣。';
//     else savingStatus = '儲蓄率偏低，建議強制執行儲蓄計畫。';

//     const baseWeight = hasGoal ? (100 / 3 / 1.2) : (100 / 3);
//     const investWeight = hasGoal ? 20 : 0;

//     const scoreL = Math.min(baseWeight, (L / 6) * baseWeight);
//     const scoreDTI = Math.min(baseWeight, (Math.max(0, 50 - DTI) / 50) * baseWeight);
//     const scoreS = Math.min(baseWeight, (S / 20) * baseWeight);
//     const scoreG = hasGoal ? Math.min(investWeight, (G / 100) * investWeight) : 0;

//     const totalScore = Math.round(scoreL + scoreDTI + scoreS + scoreG);

//     this.metrics = {
//       liquidity: { label: '緊急預備金', value: L.toFixed(1) + ' 個月', isAlert: L < 6, status: liquidStatus },
//       debt: { label: '負債比', value: DTI.toFixed(1) + '%', isAlert: DTI > 30, status: debtStatus },
//       savings: { label: '儲蓄率', value: S.toFixed(1) + '%', isAlert: S < 20, status: savingStatus },
//       investment: {
//         label: '目標達成率',
//         value: hasGoal ? G + '%' : '未設定',
//         isAlert: hasGoal ? G < 80 : false,
//         status: investStatus
//       }
//     };

//     this.initGauge(totalScore);
//     this.initRadar(L, DTI, S, G);
//     this.initHistoryLine(this.historyData);
//   }

//   initGauge(score: number) {
//     this.gaugeOption = {
//       series: [{
//         type: 'gauge',
//         startAngle: 210,
//         endAngle: -30,
//         min: 0,
//         max: 100,
//         splitNumber: 5,
//         detail: {
//           valueAnimation: true,
//           formatter: '{value} 分',
//           color: 'inherit',
//           offsetCenter: [0, '75%'], // 向下移動
//           fontSize: 30,
//           fontWeight: 'bold'
//         },
//         data: [{ value: Math.round(score), name: '健康得分' }],
//         axisLine: {
//           lineStyle: {
//             width: 15,
//             color: [[0.3, '#ff4d4f'], [0.7, '#ffec3d'], [1, '#73d13d']]
//           }
//         },
//         axisTick: { show: false },
//       axisLabel: {
//         distance: 20,
//         color: '#999',
//         fontSize: 12
//       },



//       title: {
//         offsetCenter: [0, '40%'], //上移
//         fontSize: 16,
//         color: '#8c8c8c'
//       },
//       }]
//     };
//   }

//   initRadar(L: number, DTI: number, S: number, G: number, date: string = '現在') {
//     this.radarOption = {
//       title: {
//       text: `${date} 財務狀況分析`,
//       left: 'center',
//       textStyle: { fontSize: 14 }
//     },

//     tooltip: {
//       trigger: 'item'
//     },
//       radar: {
//         radius:'60%',
//         indicator: [
//           { name: '流 動 性', max: 12 },
//           { name: '抗 壓 性\n \n(低負債)', max: 100 },
//           { name: '儲 蓄 力', max: 100 },
//           { name: '投 資 力', max: 100 }
//         ]
//       },
//       series: [{
//         type: 'radar',
//         data: [{
//           value: [L, 100 - DTI, S, G],
//           areaStyle: { color: 'rgba(115, 209, 61, 0.3)' }
//         }]
//       }]
//     };
//   }



//   initHistoryLine(data: any[]) {
//     if (!data || data.length === 0) return;
//     this.historyData = data;

//     this.historyLineOption = {
//       //提示框
//       tooltip: { trigger: 'axis' },
//       //圖
//       legend: {
//         data: ['流動性', '負債比', '儲蓄率', '投資勝率']
//       },
//       grid: {
//         left: '3%',
//         right: '8%',
//         bottom: '3%',
//         containLabel: true
//       },
//       xAxis: {
//         type: 'category',
//         data: this.historyData.map(item => item.date),
//         boundaryGap: false
//       },
//       yAxis: {
//         type: 'value',
//         name: '總分',
//       },
//       //數據列
//       series: [{
//         name: '財務總分',
//         type: 'line',
//         data:  this.historyData.map(item => item.score),
//         smooth: true,
//         symbolSize: 10,
//         triggerLineEvent: true,
//         lineStyle: {
//           width: 4,
//           color: '#5470c6'
//         },
//         areaStyle: {
//           opacity: 0.2
//         }
//       }],
//     };
//       const last = this.historyData[this.historyData.length - 1];
//         if (last) {
//           this.initRadar(last.L, last.DTI, last.S, last.G);
//         }
//   }

//   onChartClick(params: any) {
//   const index = params.dataIndex;
//   const item = this.historyData[index];

//   if (item) {
//     this.initRadar(item.L, item.DTI, item.S, item.G,item.date);
//   }
// }


