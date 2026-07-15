import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  lat: null,
  lng: null,
  address: '',
  error: null,
  loading: false,

  getLocation: () => {
    set({ loading: true, error: null });
    if (!navigator.geolocation) {
      set({ error: 'Geolocation not supported', loading: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => set({ lat: pos.coords.latitude, lng: pos.coords.longitude, loading: false }),
      (err) => set({ error: err.message, loading: false })
    );
  },

  setLocation: (lat, lng, address) => set({ lat, lng, address }),
  clearLocation: () => set({ lat: null, lng: null, address: '', error: null }),
}));
