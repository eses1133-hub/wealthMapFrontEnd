import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ExampleService } from '../@service/example.service';
import { Router } from '@angular/router';
import { HealthService } from '../services/health.service';
import { MatTooltipModule } from '@angular/material/tooltip';


interface HealthMetric {
  label: string;
  value: string;
  isAlert: boolean;
  status: string;
}
interface MetricsMap {
  [key: string]: HealthMetric;
}


@Component({
  selector: 'app-health',
  imports: [
    CommonModule,
    NgxEchartsDirective,

  ],
  providers: [
    provideEchartsCore({ echarts })
  ],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})


export class HealthComponent implements OnInit {
  userId: number | null = null;
  role!: string;
  constructor(
    private router: Router,
    private exampleService: ExampleService,
    private healthService: HealthService
  ) { }

  goRegister() {
    this.router.navigate(['/register']);
  }


  // 計算結果
  metrics: MetricsMap = {
    liquidity: { label: '', value: '', isAlert: false, status: '' },
    debt: { label: '', value: '', isAlert: false, status: '' },
    savings: { label: '', value: '', isAlert: false, status: '' },
    investment: { label: '', value: '', isAlert: false, status: '' },
  };

  gaugeOption: EChartsOption = {};
  radarOption: EChartsOption = {};


  // 假設這是你的詳細數據
  historyData = [
    { date: '2026-01', L: 6, DTI: 50, S: 70, G: 65, score: 50 }, // 1月
    { date: '2026-02', L: 7.5, DTI: 60, S: 80, G: 70, score: 65 }, // 2月
    { date: '2026-03', L: 8.5, DTI: 70, S: 90, G: 80, score: 80 }  // 3月 (目前)
  ];

  historyLineOption: any = {};
  healthData: any = null;

  isLoading: boolean = false;
  hasAsset: boolean = false;
  hasLiability: boolean = false;


  ngOnInit() {
    this.exampleService.user$.subscribe(user => {


      if (!user || !user.id) {
        console.log('user 尚未載入完成');
        return;
      }
      this.role = user.role;
      this.userId = user.id;

      if (this.userId) {
        this.fetchHealthData(this.userId);
      }
    });
  }

  initGauge(score: number) {
    this.gaugeOption = {
      series: [{
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        splitNumber: 5,
        detail: {
          valueAnimation: true,
          formatter: '{value} 分',
          color: 'inherit',
          offsetCenter: [0, '75%'], // 向下移動
          fontSize: 30,
          fontWeight: 'bold'
        },
        data: [{ value: Math.round(score), name: '健康得分' }],
        axisLine: {
          lineStyle: {
            width: 15,
            color: [[0.3, '#ff4d4f'], [0.7, '#ffec3d'], [1, '#73d13d']]
          }
        },
        axisTick: { show: false },
        axisLabel: {
          distance: 20,
          color: '#999',
          fontSize: 12
        },



        title: {
          offsetCenter: [0, '40%'], //上移
          fontSize: 16,
          color: '#8c8c8c'
        },
      }]
    };
  }

  initRadar(L: number, DTI: number, S: number, G: number, date: string = '現在') {
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
          { name: '流 動 性', max: 12 },
          { name: '抗 壓 性\n \n(低負債)', max: 100 },
          { name: '儲 蓄 力', max: 100 },
          { name: '投 資 力', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [L, 100 - DTI, S, G],
          areaStyle: { color: 'rgba(115, 209, 61, 0.3)' }
        }]
      }]
    };
  }



  initHistoryLine(data: any[]) {
    if (!data || data.length === 0) return;
    this.historyData = data;

    this.historyLineOption = {
      //提示框
      tooltip: { trigger: 'axis' },
      //圖
      legend: {
        data: ['流動性', '負債比', '儲蓄率', '投資勝率']
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
        name: '總分',
      },
      //數據列
      series: [{
        name: '財務總分',
        type: 'line',
        data: this.historyData.map(item => item.score),
        smooth: true,
        symbolSize: 10,
        triggerLineEvent: true,
        lineStyle: {
          width: 4,
          color: '#5470c6'
        },
        areaStyle: {
          opacity: 0.2
        }
      }],
    };
    const last = this.historyData[this.historyData.length - 1];
    if (last) {
      this.initRadar(last.L, last.DTI, last.S, last.G);
    }
  }

  onChartClick(params: any) {
    const index = params.dataIndex;
    const item = this.historyData[index];

    if (item) {
      this.initRadar(item.L, item.DTI, item.S, item.G, item.date);
    }
  }

  fetchHealthData(userId: number) {

    if (!userId) {
      console.warn('userId 不存在，無法取得健康資料');
      return;
    }

    this.isLoading = true;

    this.healthService.getHealth(userId).subscribe({
      next: (res) => {

        const data = res.data; // AppResponse 包裝


        console.log('health data 👉', data);

        // ✅ 空狀態控制（核心🔥）
        this.hasAsset = (data.totalAssets ?? 0) > 0;
        this.hasLiability = (data.totalLiabilities ?? 0) > 0;

        const L = data.L ?? 0;
        const DTI = data.DTI ?? 0;
        const S = data.S ?? 0;
        const G = data.G ?? 0;
        const score = data.score ?? 0;

        // 🔥 更新畫面
        this.metrics = {
          liquidity: {
            label: '緊急預備金',
            value: L.toFixed(1) + ' 個月',
            isAlert: L < 6,
            status: ''
          },
          debt: {
            label: '負債比',
            value: DTI.toFixed(1) + '%',
            isAlert: DTI > 30,
            status: ''
          },
          savings: {
            label: '儲蓄率',
            value: S.toFixed(1) + '%',
            isAlert: S < 20,
            status: ''
          },
          investment: {
            label: '理財成就率',
            value: G + '%',
            isAlert: G < 80,
            status: ''
          }
        };

        // 🔥 更新圖表
        this.initGauge(score);
        this.initRadar(L, DTI, S, G);

        this.isLoading = false; // ✅ 結束 loading

      },
      error: (err) => {
        console.error('取得健康資料失敗', err);
        this.isLoading = false;
      }
    });
  }

}

