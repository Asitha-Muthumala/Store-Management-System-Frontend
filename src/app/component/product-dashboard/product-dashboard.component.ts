import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbAlert,
  NgbModal,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { Product } from '../../shared/userModel';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { TOKEN_INVALID } from '../../shared/const';

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [
    NgFor,
    DecimalPipe,
    FormsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NgbAlert,
  ],
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
})
export class ProductDashboardComponent {
  private modalService = inject(NgbModal);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  products: any[] = [];
  page: number = 1;
  pageSize: number = 4;
  collectionSize: number = 0;

  userName: string | null = null;

  ngOnInit() {
    this.userName = this.authService.getUserName();
    this.loadProducts();
  }

  refreshProductList() {
    this.loadProducts();
  }

  loadProducts() {
    this.userService.getAllProduct(this.page, this.pageSize).subscribe(
      (data) => {
        if (data.status) {
          this.products = data.data;
          this.collectionSize = data.pagination.totalProducts;
        }
      },
      (error) => {
        console.error('Error fetching products', error);
        if (error.error.message == TOKEN_INVALID) {
          this.systemLogout();
        }
      }
    );
  }

  openAddProductModal(addProduct: TemplateRef<any>) {
    this.modalService.open(addProduct);
  }

  vpname: string = '';
  vdescription: string = '';
  vprice: number | null = null;
  vquantity: number | null = null;

  openViewProductModal(vProduct: TemplateRef<any>, id: number) {
    this.modalService.open(vProduct);
    this.userService.getProduct(id).subscribe(
      (data) => {
        if (data.status) {
          this.vpname = data.data[0].name;
          this.vdescription = data.data[0].description;
          this.vprice = data.data[0].price;
          this.vquantity = data.data[0].quantity;
        }
      },
      (error) => {
        console.error('Error fetching product details', error);
        if (error.error.message == TOKEN_INVALID) {
          this.systemLogout();
        }
      }
    );
  }

  //add product function
  pname: string = '';
  description: string = '';
  price: number | null = null;
  quantity: number | null = null;

  //validations
  addProductFormError: { [key: string]: string } = {};

  addProductFormValidation() {
    this.addProductFormError = {};

    if (this.pname.trim() == '') {
      this.addProductFormError['pNameRequired'] = 'product name required';
    }

    if (this.pname.trim() != '' && this.pname.trim().length < 5) {
      this.addProductFormError['pNameNotValid'] =
        'product name should have min 5 character';
    }

    if (this.description.trim() == '') {
      this.addProductFormError['descriptionRequired'] = 'description required';
    }

    if (this.description.trim() != '' && this.description.trim().length < 5) {
      this.addProductFormError['descriptionNotValid'] =
        'description should have min 5 character';
    }

    if (this.price == null) {
      this.addProductFormError['priceRequired'] = 'price required';
    }

    if (this.price != null && this.price < 0) {
      this.addProductFormError['priceNotValid'] = 'price not valid';
    }

    if (this.quantity == null) {
      this.addProductFormError['quantityRequired'] = 'quantity required';
    }

    if (this.quantity != null && this.quantity < 0) {
      this.addProductFormError['quantityNotValid'] = 'quantity not valid';
    }
  }

  product: Product = {
    name: '',
    description: '',
    price: null,
    quantity: null,
  };

  successMsg: string = '';
  errorMsg: string = '';

  addOneProduct() {
    this.addProductFormValidation();

    if (Object.keys(this.addProductFormError).length == 0) {
      this.product = {
        name: this.pname,
        description: this.description,
        price: this.price,
        quantity: this.quantity,
      };

      this.userService.addProduct(this.product).subscribe(
        (data) => {
          if (data.status) {
            this.successMsg = data.message;

            setTimeout(() => {
              this.successMsg = '';
              this.clearAddProductForm();
              this.loadProducts();
            }, 5000);
          }
        },
        (error) => {
          if (!error.error.status) {
            this.errorMsg = error.error.message;
            setTimeout(() => {
              this.errorMsg = '';
            }, 5000);
          }

          console.error('Error of add product', error);
          if (error.error.message == TOKEN_INVALID) {
            this.systemLogout();
          }
        }
      );
    }
  }

  clearAddProductForm() {
    this.pname = '';
    this.description = '';
    this.price = null;
    this.quantity = null;

    this.addProductFormError = {};
  }

  deleteOneProduct(id: number) {
    this.userService.deleteProduct(id).subscribe(
      (data) => {
        if (data.status) {
          this.deleteFailed = false;
          this.deleteSuccess = true;
          this.loadProducts();
        }
      },
      (error) => {
        console.error('Error of delete a product', error);
        this.deleteSuccess = false;
        this.deleteFailed = true;

        if (error.error.message == TOKEN_INVALID) {
          this.systemLogout();
        }
      }
    );
  }

  deleteFailed: boolean = false;
  deleteSuccess: boolean = false;

  closeFAlert(): void {
    this.deleteFailed = false;
  }

  closeSAlert(): void {
    this.deleteFailed = false;
  }

  openLogoutConfirmationModal(logoutConfirmation: TemplateRef<any>) {
    this.modalService.open(logoutConfirmation);
  }

  systemLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
