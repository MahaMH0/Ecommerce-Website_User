import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CartParentComponent } from './CartParent/CartParent.component';
import { ProductDetailsComponent } from './ProductDetails/ProductDetails.component';
import { CartChildComponent } from './CartChild/CartChild.component';
import { ProductCardDirective } from 'src/app/Directives/product-card.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { ShowOrdersComponent } from './ShowOrders/ShowOrders.component';
const routes:Routes=[
  {path:'', redirectTo:'/Product/Order', pathMatch:'full'},
  {path: 'Order', component:CartParentComponent},
  {path:'Details/:pid', component:ProductDetailsComponent},
  {path: 'Cart',component:CartParentComponent},
  {path:'ShowOrders',component:ShowOrdersComponent}
]

@NgModule({
  declarations: [
    CartChildComponent,
    CartParentComponent,
    ProductDetailsComponent,
    ProductCardDirective,
    ShowOrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductModule { }
