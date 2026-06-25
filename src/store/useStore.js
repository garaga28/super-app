import { create } from 'zustand'

export const useStore = create((set) => ({
  user: null,
  categories: [],
  notes: localStorage.getItem('super_app_notes') || '',

  setUser: (userData) => set({ user: userData }),

  setCategories: (categoryArray) => set({ categories: categoryArray }),

  toggleCategory: (category) => set((state) => {
    const exists = state.categories.includes(category)
    return {
      categories: exists
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category]
    }
  }),

  setNotes: (text) => {
    localStorage.setItem('super_app_notes', text)
    set({ notes: text })
  },

  resetStore: () => {
    localStorage.removeItem('super_app_notes')
    set({
      user: null,
      categories: [],
      notes: ''
    })
  }
}))
