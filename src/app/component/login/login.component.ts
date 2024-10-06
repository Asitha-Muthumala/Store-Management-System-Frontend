import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isValidEmail } from '../../shared/regex';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Login } from '../../shared/userModel';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { TOKEN_KEY, USER_NAME_KEY } from '../../shared/const';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbAlert],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = "";
  password: string = "";

  loginFormError: { [key: string]: string } = {};

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  loginFormValidation() {
    this.loginFormError = {};

    if (this.email.trim() == "") {
      this.loginFormError['emailRequired'] = 'email required';
    }

    if (this.email.trim() != "" && !isValidEmail(this.email.trim())) {
      this.loginFormError['emailNotValid'] = 'email not valid';
    }

    if (this.password.trim() == "") {
      this.loginFormError['passwordRequired'] = 'password required';
    }
  }

  loginModel: Login = {
    email: '',
    password: ''
  }

  login() {
    this.loginFormValidation();

    if (Object.keys(this.loginFormError).length == 0) {
      this.loginModel = {
        email: this.email,
        password: this.password
      }

      this.authService.setLogin(this.loginModel).subscribe(
        (data) => {
          if (data.status) {
            console.log("data", data)
            this.loginFailed = false;
            this.loginSuccess = true;

            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(USER_NAME_KEY, data.name);
            setTimeout(() => {
              this.clearLoginForm();
              this.router.navigate(['/dashboard']);
            }, 1000);
          }
        },
        (error) => {
          if (!error.error.status) {
            this.loginSuccess = false;
            this.loginFailed = true;
          }
          console.error('Error of login', error);
        }
      );
    }
  }

  clearLoginForm() {
    this.email = "";
    this.password = "";
    this.loginFormError = {};
    this.loginModel = {
      email: '',
      password: ''
    }
  }

  loginFailed: boolean = false;
  loginSuccess: boolean = false;

  closeEAlert(): void {
    this.loginFailed = false;
  }

  closeSAlert(): void {
    this.loginSuccess = false;
  }

}
