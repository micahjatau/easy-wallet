import { useContext } from 'react'
import { MobileAuthContext } from './MobileAuthContext.jsx'

export const useMobileAuthContext = () => {
  const context = useContext(MobileAuthContext)
  if (!context) {
    throw new Error('useMobileAuthContext must be used within MobileAuthProvider')
  }
  return context
}

export default useMobileAuthContext
