import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  // Verificar si hay token en localStorage
  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token.trim() !== '';
  }

  // Obtener usuario del localStorage
  private getUserFromStorage(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Guardar token y usuario después del login
  saveAuthData(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(usuario);
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener usuario actual
  getCurrentUser(): any {
    return this.currentUserSubject.getValue();
  }

  // Cerrar sesión (Logout)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  // Verificar estado de autenticación
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Verificar estado de autenticación y emitir
  private checkAuthStatus(): void {
    const isAuth = this.hasToken();
    this.isAuthenticatedSubject.next(isAuth);
  }
}
