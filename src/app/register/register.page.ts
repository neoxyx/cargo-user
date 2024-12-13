import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HttpClientModule],
})
export class RegisterPage {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  passwordMismatch = false;

  constructor(private authService: AuthService, private router: Router) { }

  goToLogin() {
    this.router.navigate(['/']);
  }
  // Método para verificar que las contraseñas coincidan
  checkPasswords() {
    this.passwordMismatch = this.user.password !== this.user.confirmPassword;
  }

  // Enviar el formulario de registro
  onRegister() {
    if (this.user.password !== this.user.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    // Enviar los datos al backend para registrar el usuario
    this.authService.register(this.user).subscribe(
      (response) => {
        console.log('Registration Successful:', response);
        // Redirigir o mostrar mensaje de éxito
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration Error:', error);
        // Mostrar mensaje de error
      }
    );
  }
}
