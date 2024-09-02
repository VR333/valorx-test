import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRouterModule } from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRouterModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
