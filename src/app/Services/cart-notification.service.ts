import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartNotificationService {
  CartItemCount:BehaviorSubject<number>;
  constructor() { 
    if(localStorage.getItem("ShopingCart") != undefined)
    {
    this.CartItemCount=new BehaviorSubject<number>(JSON.parse(localStorage.getItem("ShopingCart")!)?.length);
    }
    else
    {
      this.CartItemCount=new BehaviorSubject<number>(0);
    }
  }
}
