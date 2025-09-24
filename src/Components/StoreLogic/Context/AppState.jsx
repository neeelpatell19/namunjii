import { useEffect, useMemo, useReducer } from 'react'
import { AppContext } from './AppContext'
import { apiGet } from './apiClient'

const initialState = {
  // add global state fields here
  cartItems: [],
  user: null,
  theme: 'light',
  products: [],
  isLoadingProducts: false,
  productsError: null,
  productsPage: 1,
  productsHasMore: true,
  categories: [],
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
    case 'FETCH_PRODUCTS_START':
      return { ...state, isLoadingProducts: true, productsError: null }
    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, isLoadingProducts: false, products: action.payload }
    case 'FETCH_PRODUCTS_ERROR':
      return { ...state, isLoadingProducts: false, productsError: action.payload }
    case 'APPEND_PRODUCTS':
      return { ...state, isLoadingProducts: false, products: [...state.products, ...action.payload] }
    case 'SET_PRODUCTS_PAGE':
      return { ...state, productsPage: action.payload }
    case 'SET_PRODUCTS_HAS_MORE':
      return { ...state, productsHasMore: action.payload }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
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
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_PRODUCTS_START' })
      try {
        // Fetch page 1 to discover total pages
        const first = await apiGet('/namunjii/products?page=1')
        if (!isMounted) return
        const firstItems = Array.isArray(first)
          ? first
          : (Array.isArray(first?.data)
              ? first.data
              : (Array.isArray(first?.products) ? first.products : []))
        const totalPages = first?.pagination?.totalPages || 1
        // Fetch remaining pages in parallel (2..totalPages)
        let restItems = []
        if (totalPages > 1) {
          const requests = []
          for (let p = 2; p <= totalPages; p++) {
            requests.push(apiGet(`/namunjii/products?page=${p}`))
          }
          const responses = await Promise.allSettled(requests)
          responses.forEach(r => {
            if (r.status === 'fulfilled') {
              const d = r.value
              const arr = Array.isArray(d)
                ? d
                : (Array.isArray(d?.data) ? d.data : (Array.isArray(d?.products) ? d.products : []))
              restItems = restItems.concat(arr)
            }
          })
        }
        const allItems = [...firstItems, ...restItems]
        console.log('[AppState] Fetched ALL products:', allItems.length)
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: allItems })
        dispatch({ type: 'SET_PRODUCTS_PAGE', payload: totalPages })
        dispatch({ type: 'SET_PRODUCTS_HAS_MORE', payload: false })
        // Derive unique categories from all items
        const catSet = new Set()
        allItems.forEach(p => {
          if (Array.isArray(p?.categories)) {
            p.categories.forEach(c => {
              if (typeof c === 'string' && c.trim()) catSet.add(c.trim())
            })
          }
        })
        dispatch({ type: 'SET_CATEGORIES', payload: Array.from(catSet) })
      } catch (err) {
        if (!isMounted) return
        dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: err.message || 'Failed to load products' })
      }
    }
    fetchVendors()
    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [])

  // Load next page of products and append to list
  const loadMoreProducts = async () => {
    if (state.isLoadingProducts || !state.productsHasMore) return
    const nextPage = (state.productsPage || 1) + 1
    dispatch({ type: 'FETCH_PRODUCTS_START' })
    try {
      const data = await apiGet(`/namunjii/products?page=${nextPage}`)
      const newProducts = Array.isArray(data)
        ? data
        : (Array.isArray(data?.data)
            ? data.data
            : (Array.isArray(data?.products) ? data.products : []))
      dispatch({ type: 'APPEND_PRODUCTS', payload: newProducts })
      const totalPages = data?.pagination?.totalPages || nextPage
      const currentPage = data?.pagination?.currentPage || nextPage
      dispatch({ type: 'SET_PRODUCTS_PAGE', payload: currentPage })
      dispatch({ type: 'SET_PRODUCTS_HAS_MORE', payload: currentPage < totalPages })
      // Merge categories
      const catSet = new Set(state.categories)
      newProducts.forEach(p => {
        if (Array.isArray(p?.categories)) {
          p.categories.forEach(c => {
            if (typeof c === 'string' && c.trim()) catSet.add(c.trim())
          })
        }
      })
      dispatch({ type: 'SET_CATEGORIES', payload: Array.from(catSet) })
    } catch (err) {
      dispatch({ type: 'FETCH_PRODUCTS_ERROR', payload: err.message || 'Failed to load products' })
    }
  }

  const value = useMemo(() => ({ state, dispatch, loadMoreProducts }), [state])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}


