import { useEffect, useMemo, useReducer } from 'react'
import { AppContext } from './AppContext'
import { apiGet } from './apiClient'

const initialState = {
  // add global state fields here
  cartItems: [],
  user: null,
  theme: 'light',
  verifiedVendors: [],
  isLoadingVendors: false,
  vendorsError: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'ADD_TO_CART':
      return { ...state, cartItems: [...state.cartItems, action.payload] }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] }
    case 'FETCH_VENDORS_START':
      return { ...state, isLoadingVendors: true, vendorsError: null }
    case 'FETCH_VENDORS_SUCCESS':
      return { ...state, isLoadingVendors: false, verifiedVendors: action.payload }
    case 'FETCH_VENDORS_ERROR':
      return { ...state, isLoadingVendors: false, vendorsError: action.payload }
    default:
      return state
  }
}

export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    let isMounted = true
    const fetchVendors = async () => {
      dispatch({ type: 'FETCH_VENDORS_START' })
      try {
        const data = await apiGet('/namunjii/verified-vendors')
        if (!isMounted) return
        dispatch({ type: 'FETCH_VENDORS_SUCCESS', payload: data })
      } catch (err) {
        if (!isMounted) return
        dispatch({ type: 'FETCH_VENDORS_ERROR', payload: err.message || 'Failed to load vendors' })
      }
    }
    fetchVendors()
    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}


