// Modules
import { Routes, Route } from "react-router-dom";
// Layouts
import Layout from "./components/Layouts/Layout";
import PersistLogin from "./components/Layouts/PersistLogin";
// Login
// import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import LoginRedirection from "./features/auth/LoginRedirection";
import RequireAuth from "./components/Layouts/RequireAuth";
// import LoginRedir from "./features/auth/LoginRedir";



import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

import MenuSpravka from "./features/spravka/MenuSpravka";
import CreateSpravka from "./features/spravka/CreateSpravka";
import ReadSpravka from "./features/spravka/ReadSpravka";


function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          <Route path="/" element={<Layout />}>
            {/* change to redir later */}
            <Route index element={<LoginRedirection />} /> 
            <Route path="login" element={<Login />} />
            {/* <Route path="register" element={<Register />} /> */}
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route element={<PersistLogin />}>
              {/* <Route path="/redir" element={<LoginRedir />} /> */}
              <Route element={<RequireAuth/>}>

                <Route path="spravka">
                  <Route index element={<MenuSpravka />} />
                  <Route path="create" element={<CreateSpravka/>} />
                  <Route path="read/:id" element={<ReadSpravka/>} />
                </Route>
              </Route>

              

              
            </Route>
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
