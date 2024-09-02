import { NgModule } from '@angular/core';
import { FirstComponent } from './first.component';
import { FirstRoutingModule } from './first.routes';

@NgModule({
  imports: [FirstComponent, FirstRoutingModule]
})
export class FirstModule {}
