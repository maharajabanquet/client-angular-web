import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { InlineCalendarComponent } from './components/inline-calendar/inline-calendar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { BookingModalComponent } from './modals/booking-modal/booking-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EnquiryTableComponent } from './components/enquiry/enquiry-table/enquiry-table.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { ContactUsComponent } from './landing-page/contact-us/contact-us.component';
import { PhotogalleryComponent } from './landing-page/photogallery/photogallery.component';
import { ReviewPageComponent } from './landing-page/review-page/review-page.component';
import { OurServiceComponent } from './landing-page/our-service/our-service.component';

@NgModule({
  declarations: [
    AppComponent,
    InlineCalendarComponent,
    DashboardComponent,
    EnquiryComponent,
    BookingModalComponent,
    EnquiryTableComponent,
    LandingPageComponent,
    BookingDashboardComponent,
    FooterComponent,
    ContactUsComponent,
    PhotogalleryComponent,
    ReviewPageComponent,
    OurServiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
