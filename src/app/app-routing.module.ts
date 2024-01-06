import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'admin-mbh', component: BookingDashboardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
