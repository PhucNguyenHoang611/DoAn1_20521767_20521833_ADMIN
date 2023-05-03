import { Route, Routes } from 'react-router-dom'

import MainPage from '@/pages/MainPage/mainpage'
import Login from '@/pages/Login/login'
import NotFound from '@/pages/NotFound/notfound'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} >
        
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;