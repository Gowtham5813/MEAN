import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './Component/landingpage/landingpage.component';
import { SelectbusPageComponent } from './Component/selectbus-page/selectbus-page.component';

const routes: Routes = [
  {path:'',component:LandingpageComponent},
  {path:'select-bus',component:SelectbusPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
