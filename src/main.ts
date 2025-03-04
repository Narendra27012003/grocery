


import { provideRouter, Routes } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { SignInComponent } from './app/auth/sign-in/sign-in.component';
import { SignUpComponent } from './app/auth/sign-up/sign-up.component';
import { HomeComponent } from './app/home/home.component';
import { StockManagementComponent } from './app/stock-management/stock-management.component';
import { ShipmentTrackingComponent } from './app/shipment-tracking/shipment-tracking.component';


const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: 'stocks', component: StockManagementComponent },
  { path: 'shipments', component: ShipmentTrackingComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
