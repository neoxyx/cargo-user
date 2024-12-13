import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login Successful:', response);
        // Guardar el token en almacenamiento local o en memoria
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('username', response.user.name);
        this.router.navigate(['/home/solicitar-vehiculo']);
      },
      (error) => {
        this.errorMessage = error?.error?.message || 'An error occurred.';
        console.error('Login Error:', error);
      }
    );
  }

  // Login with Google
  async googleLogin() {
    try {
      const user = await GoogleAuth.signIn();
      console.log('Google Login successful:', user);
      // Enviar el token a tu backend para validación
      this.authService.socialLogin(user.authentication.idToken).subscribe(
        (response) => {
          console.log('Social Login Success:', response);
          localStorage.setItem('authToken', response.token);
        },
        (error) => {
          console.error('Social Login Error:', error);
        }
      );
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  }
}
