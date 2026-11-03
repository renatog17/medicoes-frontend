import { useEffect } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import { navigate, useRouter } from './hooks/useRouter.js'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { routes } from './router.js'
import './App.css'

export default function App() {
  const { pathname, section } = useRouter()
  const route = routes[section]
  const Page = route?.component || NotFoundPage

  useEffect(() => {
    if (pathname === '/') navigate('/clientes', { replace: true })
  }, [pathname])

  return (
    <AppLayout section={section}>
      <Page key={section || pathname} />
    </AppLayout>
  )
}
