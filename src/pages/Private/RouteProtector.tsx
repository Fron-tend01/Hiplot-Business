
import { Navigate, Route} from 'react-router-dom'
import { PrivateRoutes } from '../../models/routes'
import RoutesWithNotFonud from '../../utils/routes-with-not-found'
import { lazy } from 'react'

const RootPage = lazy(() => import('./Home/RootPage'))
const WebPage = lazy(() => import ('../../pages/Private/webNavigation/WebNavigation'))

const RouteProtector = () => {
  return (
    <RoutesWithNotFonud>
      <Route path='/' element={<Navigate to={PrivateRoutes.HOME} />} />
      <Route path={PrivateRoutes.WEBPAGE} element={<WebPage />} />
      <Route path={PrivateRoutes.HOME} element={<RootPage />} />
      <Route path={PrivateRoutes.WEBPAGE} element={<WebPage />} />
    </RoutesWithNotFonud>
  )
}

export default RouteProtector
