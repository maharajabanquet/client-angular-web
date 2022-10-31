import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { InlineCalendarComponent } from './components/inline-calendar/inline-calendar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { BookingModalComponent, DialogOverviewExampleDialog } from './modals/booking-modal/booking-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EnquiryTableComponent } from './components/enquiry/enquiry-table/enquiry-table.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BookingDashboardComponent } from './booking-dashboard/booking-dashboard.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { ContactUsComponent } from './landing-page/contact-us/contact-us.component';
import { PhotogalleryComponent, DialogContentExampleDialog } from './landing-page/photogallery/photogallery.component';
import { ReviewPageComponent } from './landing-page/review-page/review-page.component';
import { OurServiceComponent } from './landing-page/our-service/our-service.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { BnNgIdleService } from 'bn-ng-idle';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; // import bn-ng-idle service
import { PublicCalendarComponent } from './public-calendar/public-calendar.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { QRCodeModule } from 'angularx-qrcode';
import { QrcodeGenComponent } from './components/qrcode-gen/qrcode-gen.component';
import { TentHouseComponent } from './tent-house/tent-house.component';
import { TentHouseTableComponent } from './tent-house/tent-house-table/tent-house-table.component';
import { LazyImgDirectiveDirective } from './lazy-img-directive.directive';
import { ManagementComponent } from './management/management.component';
import { CommonModalDialog, DataTableComponent } from './data-table/data-table.component';

@NgModule({
  declarations: [
    PublicCalendarComponent,
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
    OurServiceComponent,
    QrcodeGenComponent,
    DialogOverviewExampleDialog,
    TentHouseComponent,
    TentHouseTableComponent,
    LazyImgDirectiveDirective,
    ManagementComponent,
    DataTableComponent,
    CommonModalDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgImageSliderModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    QRCodeModule,
    
  ],
  providers: [BnNgIdleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
