import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { RiskGuard } from './guards/risk.guard';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () => import('./main/main.component').then((m) => m.MainComponent)
  },
  {
    path: 'risk-test',
    loadComponent: () =>
      import('./features/risk-assessment/pages/risk-test/risk-test.component').then((m) => m.RiskTestComponent)
  },
  {
    path: 'risk-result',
    loadComponent: () =>
      import('./features/risk-assessment/pages/risk-result/risk-result.component').then((m) => m.RiskResultComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'information',
    loadComponent: () =>
      import('./admin-information-set/admin-information-set.component').then((m) => m.AdminInformationSetComponent)
  },
  {
    path: 'service',
    loadComponent: () => import('./admin-service-set/admin-service-set.component').then((m) => m.AdminServiceSetComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./admin-privacy-set/admin-privacy-set.component').then((m) => m.AdminPrivacySetComponent)
  },
  {
    path: 'system-notification',
    loadComponent: () => import('./notification/notification.component').then((m) => m.NotificationComponent)
  },
  {
    path: 'system-notification/:pageId',
    loadComponent: () => import('./notification/notification.component').then((m) => m.NotificationComponent)
  },
  {
    path: 'risk-cover',
    loadComponent: () =>
      import('./features/risk-assessment/pages/risk-cover/risk-cover.component').then((m) => m.RiskCoverComponent)
  },
  {
    path: 'investment-manage',
    loadComponent: () => import('./investment-manage/investment-manage.component').then((m) => m.InvestmentManageComponent)
  },
  {
    path: 'goals',
    loadComponent: () =>
      import('./features/financial-goals/pages/goal-overview/goal-overview.component').then(
        (m) => m.GoalOverviewComponent
      )
  },
  {
    path: 'health',
    loadComponent: () => import('./health/health.component').then((m) => m.HealthComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'notification-set',
        loadComponent: () =>
          import('./admin-notification-set/admin-notification-set.component').then(
            (m) => m.AdminNotificationSetComponent
          )
      },
      {
        path: 'notification-set/:pageId',
        loadComponent: () =>
          import('./admin-notification-set/admin-notification-set.component').then(
            (m) => m.AdminNotificationSetComponent
          )
      },
      {
        path: 'news',
        loadComponent: () => import('./admin-news/admin-news.component').then((m) => m.AdminNewsComponent)
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./admin-user-management/admin-user-management.component').then((m) => m.AdminUserManagementComponent)
      }
    ]
  },
  {
    path: 'personal-notification',
    loadComponent: () => import('./notification/notification.component').then((m) => m.NotificationComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'personal-notification/:pageId',
    loadComponent: () => import('./notification/notification.component').then((m) => m.NotificationComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'investment-manage',
    loadComponent: () => import('./investment-manage/investment-manage.component').then((m) => m.InvestmentManageComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'strategy-list',
    loadComponent: () => import('./strategy-list/strategy-list.component').then((m) => m.StrategyListComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'monte',
    loadComponent: () => import('./monte/monte.component').then((m) => m.MonteComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'health',
    loadComponent: () => import('./health/health.component').then((m) => m.HealthComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'assets',
    loadComponent: () =>
      import('./features/assets/pages/asset-overview/asset-overview.component').then((m) => m.AssetOverviewComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'risk-cover',
    loadComponent: () =>
      import('./features/risk-assessment/pages/risk-cover/risk-cover.component').then((m) => m.RiskCoverComponent),
    canActivate: [RiskGuard]
  },
  {
    path: 'portfolio-recommendation',
    loadComponent: () =>
      import('./features/risk-assessment/pages/portfolio-recommendation/portfolio-recommendation.component').then(
        (m) => m.PortfolioRecommendationComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  {
    path: 'cash-flow',
    loadComponent: () =>
      import('./features/cash-flow/pages/cash-flow-overview/cash-flow-overview.component').then(
        (m) => m.CashFlowOverviewComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: '**', redirectTo: 'main', pathMatch: 'full' }
];
