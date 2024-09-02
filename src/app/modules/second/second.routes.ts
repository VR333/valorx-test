import { RouterModule, Routes } from '@angular/router';
import { SecondComponent } from './second.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: SecondComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecondRoutingModule {}