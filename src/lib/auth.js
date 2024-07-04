import { goto } from '$app/navigation';

/* Todo: make work */

export function checkAuth(routeId) {
  const publicRoutes = ['/login', '/register', '/verify', '/about']; // Add more public routes if needed
  if (!localStorage.getItem('token') && !publicRoutes.includes(routeId)) {
    goto('/login');
  }
}
