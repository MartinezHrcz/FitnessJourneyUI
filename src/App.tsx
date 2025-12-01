import {Route, BrowserRouter, Routes} from "react-router-dom";
import {appRoutes} from "./routes/appRoutes.ts";
import LoginPage from "./pages/auth/LoginPage.tsx";

function App() {

  return (
      <BrowserRouter>
        <Routes>
            {appRoutes.map((route) =>
                (
                    <Route key={route.path} path={route.path} element={route.element} />
                )
            )}
            <Route path="*" element={<LoginPage/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
