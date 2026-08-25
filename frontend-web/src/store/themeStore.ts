import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  modoOscuro: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      modoOscuro: false,
      toggle: () => {
        const nuevo = !get().modoOscuro;
        document.documentElement.classList.toggle('dark', nuevo);
        set({ modoOscuro: nuevo });
      },
    }),
    {
      name: 'bodega-theme',
      onRehydrateStorage: () => (state) => {
        // al recargar la página, vuelve a aplicar la clase 'dark' según lo guardado
        if (state?.modoOscuro) {
          document.documentElement.classList.add('dark');
        }
      },
    },
  ),
);