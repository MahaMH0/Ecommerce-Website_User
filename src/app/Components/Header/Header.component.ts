import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CartNotificationService } from 'src/app/Services/cart-notification.service';
import { UserAuthenticatingService } from 'src/app/Services/user-authenticating.service';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges{
  IsUserLogged:boolean;
  CartItemsCount:number;
  constructor(private UserAuthenticationService:UserAuthenticatingService
    ,private CartNotificationservice:CartNotificationService
    ) {
    this.IsUserLogged=localStorage.getItem('token') ? true : false;
    console.log("Login",this.IsUserLogged);
    this.UserAuthenticationService.getStatusLoging().subscribe(status=>{
      this.IsUserLogged=status;
    });
    this.CartItemsCount= JSON.parse(localStorage.getItem("ShopingCart")!)?.length;
    console.log(this.CartItemsCount);
    this.CartNotificationservice.CartItemCount
    .subscribe(count=>
      {
        this.CartItemsCount=count;
      });
   }
  ngOnChanges(changes: SimpleChanges): void {
    this.CartItemsCount= JSON.parse(localStorage.getItem("ShopingCart")!)?.length;
    this.CartNotificationservice.CartItemCount
    .subscribe(count=>
      {
        this.CartItemsCount=count;
      });
  
  }
  ngOnInit() {
    this.CartItemsCount= JSON.parse(localStorage.getItem("ShopingCart")!)?.length;
    this.IsUserLogged=localStorage.getItem('token') ? true : false; //UserAuthenticationService.ISloggedin;
    this.UserAuthenticationService.getStatusLoging().subscribe(status=>{
      this.IsUserLogged=status;
    });

    this.CartNotificationservice.CartItemCount
      .subscribe(count=>
        {
          this.CartItemsCount=count;
        });
    

  }

  ngAfterViewInit(): void {


 }

}
