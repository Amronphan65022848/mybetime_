import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateBetterTimesWithAiComponent } from './create-better-times-with-ai/create-better-times-with-ai.component';
import { BetimeSolutionsComponent } from './betime-solutions/betime-solutions.component';

import { LandingComponent } from './landing/landing.component';
import { ChatComponent } from './chat/chat.component';
import { UploadComponent } from './upload/upload.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AiChatComponent } from './ai-chat/ai-chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CreateBetterTimesWithAiComponent,
    BetimeSolutionsComponent,
   LandingComponent,
   ChatComponent,
   UploadComponent,
   AiChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    BrowserAnimationsModule, // นำเข้าโมดูลนี้
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
