import { createSlice } from '@reduxjs/toolkit';

// Rehydrate from localStorage so login persists across page refresh
const saved = (() => {
  try { return JSON.parse(localStorage.getItem('pashuseva_auth') || 'null'); }
  catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    saved?.user    || null,   // { id, name, email, role, ... }
    token:   saved?.token   || null,
    isAdmin: saved?.isAdmin || false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user    = user;
      state.token   = token;
      state.isAdmin = user?.role === 'admin';
      localStorage.setItem('pashuseva_auth', JSON.stringify({ user, token, isAdmin: state.isAdmin }));
    },
    logout: (state) => {
      state.user    = null;
      state.token   = null;
      state.isAdmin = false;
      localStorage.removeItem('pashuseva_auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectUser    = (state) => state.auth.user;
export const selectToken   = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectIsLoggedIn = (state) => !!state.auth.token;

// legacy compat
export const loginAdmin  = setCredentials;
export const logoutAdmin = logout;

export default authSlice.reducer;
