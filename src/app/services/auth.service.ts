import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRs } from '../demo/pages/login/models/login-rs';
import { Usuario } from '../demo/pages/usuario/models/usuario';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  usuario: Usuario | null;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'auth_user';
  private readonly ROLES_KEY = 'auth_roles';

  private authStateSubject = new BehaviorSubject<AuthState>(this.getInitialAuthState());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private readonly router: Router) {
    this.checkExistingAuth();
  }

  private getInitialAuthState(): AuthState {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    const rolesStr = localStorage.getItem(this.ROLES_KEY);

    return {
      isAuthenticated: !!token,
      token: token,
      usuario: userStr ? JSON.parse(userStr) : null,
      roles: rolesStr ? JSON.parse(rolesStr) : []
    };
  }

  private checkExistingAuth(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      return;
    } else if (token) {
      this.logout();
    }
  }

  /**
   * Decodifica el payload del JWT
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /**
   * Realiza el login del usuario extrayendo datos del JWT
   */
  login(loginResponse: LoginRs, usuario?: Usuario): void {
    const token = loginResponse.token;
    
    // Decodificar el JWT para extraer información
    const payload = this.decodeToken(token);
    
    // Crear objeto usuario con datos del JWT si no viene usuario
    let usuarioData: Partial<Usuario> | null = null;
    
    if (usuario) {
      usuarioData = usuario;
      // Si viene usuario pero sin rol, intentar obtenerlo del JWT
      if (!usuarioData.rol && payload?.rol) {
        usuarioData.rol = payload.rol;
      }
    } else {
      // Crear usuario parcial desde el JWT
      usuarioData = {
        username: payload?.sub,
        email: payload?.correo,
        rol: payload?.rol || 'PACIENTE'
      };
    }
    
    const roles = usuarioData?.rol ? [usuarioData.rol] : [];
    
    // Guardar en localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuarioData));
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));

    // Actualizar estado
    const newState: AuthState = {
      isAuthenticated: true,
      token: token,
      usuario: usuarioData as Usuario,
      roles: roles
    };

    this.authStateSubject.next(newState);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    const newState: AuthState = {
      isAuthenticated: false,
      token: null,
      usuario: null,
      roles: []
    };

    this.authStateSubject.next(newState);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserRoles(): string[] {
    const rolesStr = localStorage.getItem(this.ROLES_KEY);
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      // Usar fecha_fin_sesion que es el claim que usa tu backend
      return payload.fecha_fin_sesion > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  get isAuthenticated$(): Observable<boolean> {
    return new Observable(observer => {
      this.authState$.subscribe(state => {
        observer.next(state.isAuthenticated);
      });
    });
  }
}