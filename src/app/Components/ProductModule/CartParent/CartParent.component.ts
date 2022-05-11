import { Location } from '@angular/common';
import { isNgTemplate } from '@angular/compiler';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IOrder } from 'src/app/Models/IOrder';
import { CartNotificationService } from 'src/app/Services/cart-notification.service';
import { CategoryService } from 'src/app/Services/category.service';
import { OrderService } from 'src/app/Services/order.service';
import { ProductAPIService } from 'src/app/Services/product-api.service';
import { ShopingCartitemService } from 'src/app/Services/shoping-cartitem.service';
import { UserAuthenticatingService } from 'src/app/Services/user-authenticating.service';
import { ICategory } from 'src/app/ViewModels/ICategory';
import { IProduct } from 'src/app/ViewModels/IProduct';
import { ShopingCartItems } from 'src/app/ViewModels/ShoppingCartItems';
import { CartChildComponent } from '../CartChild/CartChild.component';

@Component({
  selector: 'app-CartParent',
  templateUrl: './CartParent.component.html',
  styleUrls: ['./CartParent.component.scss']
})
export class CartParentComponent implements OnInit ,OnChanges{
  CategoryList:ICategory[]=[];
  SelectedCategoryID: number=0;
  Cart:ShopingCartItems[]=[];
  Productlist:IProduct[]=[];
  TotalPrice:number=0;
  CartClicked:boolean;
  IsUserLogged:boolean=false;
  NewOrder:IOrder={} as IOrder;
  @ViewChild(CartChildComponent) CartChildInstance!: CartChildComponent;
  constructor(private CategoryAPIService:CategoryService,
  private ProductApiService:ProductAPIService
  ,private CartNotificationservice:CartNotificationService
  ,private activatedroute:ActivatedRoute
  ,private location:Location
  ,private router:Router
  ,private shopingcartitemsService:ShopingCartitemService
  ,private orderservice:OrderService
  ,private UserAuthenticationService:UserAuthenticatingService
  ) { 
    this.CategoryAPIService.GetAllCategories().subscribe(categorylist=>{
      this.CategoryList=categorylist;
    });
    this.CartClicked=this.router.url.includes("Cart");
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.SelectedCategoryID==0)
    {
      this.ProductApiService.GetAllProducts()
      .subscribe(productlist=>{
        this.Productlist=productlist;
      });
    }
    else
    {
      this.ProductApiService.GetAllProductsByCategoryID(this.SelectedCategoryID)
      .subscribe(productlist=>{
        this.Productlist=productlist;
      });
    }
  }
  ngOnInit() {
    if(localStorage.getItem("ShopingCart") != null)
    {
    this.Cart=JSON.parse(localStorage.getItem("ShopingCart")!);
    this.TotalPrice=0; 
    for(let item of this.Cart)
     {
       this.TotalPrice+=item.itemPrice * item.selectedQuantity;
     }
    }
    this.ProductApiService.GetAllProducts().subscribe(productlist=>{
      this.Productlist=productlist;
    })
    this.UserAuthenticationService.getStatusLoging().subscribe(status=>{
      this.IsUserLogged=status;
    });
    console.log(this.router.url.includes("Cart"));
    this.CartClicked=this.router.url.includes("Cart");
    this.CartNotificationservice.CartItemCount.next(this.Cart.length);
    this.UserAuthenticationService.getStatusLoging().subscribe(status=>{
    this.IsUserLogged=status;
    })
  }
  UpdateCart(product:IProduct)
  {
    var CartItem=<ShopingCartItems>
    { productID: product.id , productName:product.name, itemPrice : product.price,selectedQuantity:this.CartChildInstance.quantityneed};    

    if(this.Cart.find(productitem=>productitem.productID==product.id) == null)
    {
      this.Cart.push(CartItem);
      this.CartNotificationservice.CartItemCount.next(this.Cart.length);
    }
     this.TotalPrice=0; 
     for(let item of this.Cart)
      {
        this.TotalPrice+=item.itemPrice * item.selectedQuantity;
      }
      localStorage.removeItem("ShopingCart");
      localStorage.setItem("ShopingCart",JSON.stringify(this.Cart));
  }
  Decrease(item:ShopingCartItems)
  {
    if(item.selectedQuantity!=1)
    {
      --item.selectedQuantity;
      this.TotalPrice=0; 
      for(let item of this.Cart)
       {
         this.TotalPrice+=item.itemPrice * item.selectedQuantity;
       }
    }
    localStorage.removeItem("ShopingCart");
    localStorage.setItem("ShopingCart",JSON.stringify(this.Cart));
  }
  Increase(item:ShopingCartItems)
  {
    var product=this.Productlist.find(p=>p.id==item.productID);
     if(item.selectedQuantity != product?.quantity)
     {
      ++item.selectedQuantity;
      this.TotalPrice=0; 
      for(let item of this.Cart)
       {
         this.TotalPrice+=item.itemPrice * item.selectedQuantity;
       }
     }
     localStorage.removeItem("ShopingCart");
     localStorage.setItem("ShopingCart",JSON.stringify(this.Cart));
  }
  DeleteFromCart(item:ShopingCartItems)
  {
    var index=this.Cart.findIndex(p=>p.productID==item.productID);
    this.Cart.splice(index,1);
    this.TotalPrice=0; 
    for(let item of this.Cart)
     {
       this.TotalPrice+=item.itemPrice * item.selectedQuantity;
     }
     this.CartNotificationservice.CartItemCount.next(this.Cart.length);

     localStorage.removeItem("ShopingCart");
     localStorage.setItem("ShopingCart",JSON.stringify(this.Cart));
  }
  UpdateProductList(UpdateProductItems:IProduct[])
  {
    this.Productlist=UpdateProductItems;
  }

  ngAfterViewInit(): void {
  }

  CheckOut()
  {
    for(let item of this.Productlist)
    {
      var product=this.Cart.find(p=>p.productID==item.id)
      if(product)
      {
         item.quantity-=product.selectedQuantity;
         this.ProductApiService.updateProduct(item.id,item).subscribe();
      }

    }
    this.orderservice.AddNewOrder(this.TotalPrice).subscribe(order=>
      {
        this.NewOrder=order;
        for(let cart of this.Cart) {
          cart.orderId=this.NewOrder.id;
        }
          this.shopingcartitemsService.InsertCart(this.Cart).subscribe(cart=>
            {
              this.Cart=[];
              this.TotalPrice=0;
            });        
      });
  
    this.CartNotificationservice.CartItemCount.next(this.Cart.length);
    localStorage.removeItem("ShopingCart");
  }
}
