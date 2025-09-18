import { createContext, useContext } from 'react'

// Context only: no state here. Keep state in AppState.jsx
export const AppContext = createContext(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}


