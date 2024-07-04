import { goto } from '$app/navigation';
import api from '$lib/axios';
import { writable } from 'svelte/store';

export const userEmail = writable(null);

export async function getUserInfo(routeId) {
  const publicRoutes = ['/login', '/register', '/verify', '/about']; // Add more public routes if needed
  try {
    const response = await api.get('/auth/me');
    userEmail.set(response.data.email);
  } catch (error) {
    if (!publicRoutes.includes(routeId)) {
      goto('/login');
    }
  }
}
