import { Route, Routes } from 'react-router-dom'
import LandingHome from './routes/landing/LandingHome'
import KioskHome from './routes/kiosk/KioskHome'
import TrackingHome from './routes/tracking/TrackingHome'
import PanelHome from './routes/panel/PanelHome'
import StaffHome from './routes/staff/StaffHome'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingHome />} />
      <Route path="/totem" element={<KioskHome />} />
      <Route path="/acompanhar" element={<TrackingHome />} />
      <Route path="/painel" element={<PanelHome />} />
      <Route path="/equipe" element={<StaffHome />} />
    </Routes>
  )
}
