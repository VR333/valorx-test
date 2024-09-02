import { NgModule } from '@angular/core';
import { UserService } from '@services';
import { SecondComponent } from './second.component';
import { SecondRoutingModule } from './second.routes';


@NgModule({
  imports: [SecondComponent, SecondRoutingModule],
  providers: [UserService]
})
export class SecondModule {}
