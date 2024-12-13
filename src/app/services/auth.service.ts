import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private readonly http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        const loginData = { email, password };
        return this.http.post(`${environment.apiUrl}/auth/login`, loginData);
    }

    // Método para obtener el userId desde el token
    getUserId(): string | null {
        const token = localStorage.getItem('authToken'); // Obtener el token del localStorage
        if (!token) {
            return null; // Si no existe el token, devolver null
        }

        try {
            const decodedToken: any = jwtDecode(token); // Decodificar el JWT
            console.log(decodedToken);
            return decodedToken.id || null; // Retornar el userId si está presente en el token
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }

    getName(): string | null {
        const token = localStorage.getItem('authToken'); // Obtener el token del localStorage
        if (!token) {
            return null; // Si no existe el token, devolver null
        }

        try {
            const decodedToken: any = jwtDecode(token); // Decodificar el JWT
            console.log(decodedToken);
            return decodedToken.name || null; // Retornar el userId si está presente en el token
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }

    // Método para obtener el token
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Método para verificar si el usuario está autenticado
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        const decodedToken: any = jwtDecode(token);
        // Verificar que el token no haya expirado
        return decodedToken.exp > Date.now() / 1000; // Verificar si el token está vencido
    }

    // Método para guardar el token en localStorage (por si lo necesitas)
    saveToken(token: string): void {
        localStorage.setItem('authToken', token);
    }

    // Método para eliminar el token (logout)
    logout(): void {
        localStorage.removeItem('authToken');
    }

    // Método de login para social login (Google/Facebook)
    socialLogin(token: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/social-login`, { token });
    }

    // Método para registrar un usuario
    register(user: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/users`, user);
    }
}

