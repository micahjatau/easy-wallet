import { useEffect, useState } from 'react'
import BottomNav from './BottomNav.jsx'

const MobileNavLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <div className="pb-24 lg:pb-0">
        {children}
      </div>
      {isMobile && <BottomNav />}
    </>
  )
}

export default MobileNavLayout
