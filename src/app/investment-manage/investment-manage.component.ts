import { Component, signal, OnInit } from '@angular/core';
import { StrategyListComponent } from '../strategy-list/strategy-list.component';
import { ExampleService } from '../@service/example.service';
import { MonteComponent } from '../monte/monte.component';
import { Router } from '@angular/router';
import { Rebalance } from '../rebalance/rebalance';

@Component({
  selector: 'app-investment-manage',
  imports: [ StrategyListComponent,MonteComponent,Rebalance],
  templateUrl: './investment-manage.component.html',
  styleUrl: './investment-manage.component.scss'
})
export class InvestmentManageComponent{
  constructor(
    private exampleService: ExampleService
  ) {}

  // 定義目前的頁籤狀態，預設為 'strategy'
  currentTab = signal<'rebalance' | 'strategy' | 'engine'>('strategy');

  role!: string;
  userId!: number;
  userName!: string;

  // 切換頁籤的方法
  switchTab(tab: 'rebalance' | 'strategy' | 'engine') {
    this.currentTab.set(tab);
  }

  ngOnInit(): void {
    this.exampleService.user$.subscribe(user => {
      if (user && user.id !== 0) {
        this.role = user.role;
        this.userId = user.id;
        this.userName = user.name;
      }
    });
  }
}
