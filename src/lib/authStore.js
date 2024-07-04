import { writable } from 'svelte/store';

function createAuthStore() {
  const { subscribe, set } = writable(getInitialToken());

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', () => {
      set(getInitialToken());
    });
  }

  function getInitialToken() {
    return typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
  }

  return {
    subscribe,
    setToken: (token) => {
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        set(!!token);
      }
    }
  };
}

export const authStore = createAuthStore();