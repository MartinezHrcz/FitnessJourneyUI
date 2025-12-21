import {Route, BrowserRouter, Routes} from "react-router-dom";
import {appRoutes} from "./routes/appRoutes.ts";

function App() {

  return (
      <BrowserRouter>
        <Routes>
            {appRoutes.map((route) =>
                (
                    <Route key={route.path} path={route.path} element={route.element} />
                )
            )}
        </Routes>
      </BrowserRouter>
  )
}

export default App
