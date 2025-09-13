import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth';

  async register(data: { email: string; password: string; first_name?: string; last_name?: string; role?: string }) {
    const resp = await fetch(`${this.baseUrl}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await resp.json();
    if (!resp.ok) throw json;
    return json;
  }

  async login(email: string, password: string) {
    const resp = await fetch(`${this.baseUrl}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await resp.json();
    if (!resp.ok) throw json;
    localStorage.setItem('user', JSON.stringify(json));
    return json;
  }

  logout() {
    // Optionally call backend logout if needed
    fetch(`${this.baseUrl}/logout/`, { method: 'POST' }).finally(() => {
      localStorage.removeItem('user');
    });
  }

  getUser() { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; }
  isAuthenticated() { return !!this.getUser(); }
}
