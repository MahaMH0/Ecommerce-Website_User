import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductAPIService } from 'src/app/Services/product-api.service';
import { IProduct } from 'src/app/ViewModels/IProduct';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../ProductDetails/ProductDetails.component';

@Component({
  selector: 'app-CartChild',
  templateUrl: './CartChild.component.html',
  styleUrls: ['./CartChild.component.scss']
})
export class CartChildComponent implements OnInit ,OnChanges {
  public ProductList:IProduct[]=[];
  public quantityneed:number=0;
  @Input() receivedSelCategoryID: number=0;
  CategoryProductList: IProduct[];
  @Output() AddProductToCart: EventEmitter<IProduct>;
  @Output() UpdatedProducts: EventEmitter<IProduct[]>;

  constructor(private ProductAPIService : ProductAPIService
    ,private matDialog: MatDialog
    ) {
   this.AddProductToCart=new EventEmitter<IProduct>();
   this.UpdatedProducts=new EventEmitter<IProduct[]>();
    this.CategoryProductList=[];
    this.ProductAPIService.GetAllProducts().subscribe(productlist=>{
      this.ProductList=productlist;
    })
   }
   
  ngOnChanges(changes: SimpleChanges): void {
      console.log(this.receivedSelCategoryID);
      if (this.receivedSelCategoryID==0)
      {
        this.ProductAPIService.GetAllProducts()
        .subscribe(productlist=>{
          this.CategoryProductList=productlist;
        });
      }
      else
      {
        this.ProductAPIService.GetAllProductsByCategoryID(this.receivedSelCategoryID)
        .subscribe(productlist=>{
          this.CategoryProductList=productlist;
        });
      }
  }
  ngOnInit() {
  }

  Decrease(quantityneeded:any)
  {
    if(quantityneeded.value!=0)
    {
      quantityneeded.value-=1;
    }

  }
  Increase(item:IProduct, quantityneeded:any)
  {
    if(quantityneeded.value != item.quantity)
    {
      ++quantityneeded.value;
    }
  }
  AddToCart(item:IProduct,quantityneededvalue:number)
  {
    this.quantityneed=quantityneededvalue;
    this.AddProductToCart.emit(item);
    this.UpdatedProducts.emit(this.ProductList);
  }

  openDetailsModal(Productid:number) {
    this.matDialog.open(ProductDetailsComponent, {
      "width": '50%',
      "maxHeight": 'auto',
      "data": Productid,
      "autoFocus": true
    });
  }
}
