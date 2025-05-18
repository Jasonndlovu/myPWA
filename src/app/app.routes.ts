import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./Pages/onboarding/onboarding.page').then( m => m.OnboardingPage)
  },
  {
    path: 'messenger',
    loadComponent: () => import('./Pages/messenger/messenger.page').then( m => m.MessengerPage)
  },
  {
     path: 'chat/:chatId', loadComponent: () => import('./Pages/chat/chat.page').then(m => m.ChatPage) 
  },
  {
    path: 'profile',
    loadComponent: () => import('./Pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./Pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'users',
    loadComponent: () => import('./Pages/user-list/user-list.page').then( m => m.UsersListPage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./Pages/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'profile-settings',
    loadComponent: () => import('./Pages/profile-settings/profile-settings.page').then( m => m.ProfileSettingPage)
  },
  {
    path: 'card',
    loadComponent: () => import('./Pages/card/card.page').then( m => m.CardPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./Pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'reviews',
    loadComponent: () => import('./Pages/reviews/reviews.page').then( m => m.ReviewsPage)
  },
  {
    path: 'property-information',
    loadComponent: () => import('./Pages/property-information/property-information.page').then( m => m.PropertyInformationPage)
  },
  {
    path: 'available-jobs',
    loadComponent: () => import('./Pages/available-jobs/available-jobs.page').then( m => m.AvailableJobsPage)
  },
  {
    path: 'accept-service',
    loadComponent: () => import('./Pages/accept-service/accept-service.page').then( m => m.AcceptServicePage)
  },
  {
    path: 'accept-job',
    loadComponent: () => import('./Pages/accept-job/accept-job.page').then( m => m.AcceptJobPage)
  },
  {
    path: 'cleaner-profile',
    loadComponent: () => import('./Pages/cleaner-profile/cleaner-profile.page').then( m => m.CleanerProfilePage)
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./Pages/user-profile/user-profile.page').then( m => m.UserProfilePage)
  },
  {
    path: 'add-property-type',
    loadComponent: () => import('./Pages/add-property-type/add-property-type.page').then( m => m.AddPropertyTypePage)
  },
  {
    path: 'add-user-property',
    loadComponent: () => import('./Pages/add-user-property/add-user-property.page').then( m => m.AddUserPropertyPage)
  },
  {
    path: 'landing',
    loadComponent: () => import('./Pages/landing/landing.page').then( m => m.LandingPage)
  },
  {
    path: 'upcoming-jobs',
    loadComponent: () => import('./Pages/upcoming-jobs/upcoming-jobs.page').then( m => m.UpcomingJobsPage)
  },
  {
    path: 'view-service',
    loadComponent: () => import('./Pages/view-service/view-service.page').then( m => m.ViewtServicePage)
  },
  {
    path: 'service-history',
    loadComponent: () => import('./Pages/service-history/service-history.page').then( m => m.ServiceHistoryPage)
  },
  {
    path: 'find-cleaner',
    loadComponent: () => import('./Pages/find-cleaner/find-cleaner.page').then( m => m.FindCleanerPage)
  },
];
