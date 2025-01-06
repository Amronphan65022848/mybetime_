import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBetterTimesWithAiComponent } from './create-better-times-with-ai/create-better-times-with-ai.component';
import { BetimeSolutionsComponent } from './betime-solutions/betime-solutions.component';
import { ChatComponent } from './chat/chat.component';
import { UploadComponent } from './upload/upload.component';
import { LandingComponent } from './landing/landing.component';
import { AiChatComponent } from './ai-chat/ai-chat.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent, data: { animation: 'landing' } },
  { path: 'craete', component: CreateBetterTimesWithAiComponent},
  { path: 'betimesolution', component: BetimeSolutionsComponent},
  { path: 'chat', component: ChatComponent},
  { path: 'upload', component: UploadComponent,data: { animation: 'UploadPage' }},
  { path: 'ai', component: AiChatComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
