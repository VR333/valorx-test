import { RouterModule, Routes } from '@angular/router';
import { FirstComponent } from './first.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: FirstComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstRoutingModule {}