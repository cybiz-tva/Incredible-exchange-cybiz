import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { Login } from "./routes/Login";
import { OnlyUnauthenticated } from "./components/ProtectedRouting";
import { Home } from "./routes/Home";
import { Navbar } from "./components/Navbar/Navbar";
import { Welcome } from "./routes/Welcome";
import { ThemeContext } from "./context/ThemeContext";
import { News } from "./routes/News";
import { useFetchNewsArticles } from "./hooks/useFetchNewsArticles";

export const RouteSwitch = () => {
  useFetchNewsArticles();

  return (
    <ThemeContext>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/crypto-exchange/" element={<Welcome />} />
          <Route path="/crypto-exchange/home" element={<Home />} />
          <Route path="/crypto-exchange/news" element={<News />} />
          <Route
            path="/crypto-exchange/login"
            element={
              <OnlyUnauthenticated>
                <Login />
              </OnlyUnauthenticated>
            }
          />
          <Route path="*" element={<Navigate to="/crypto-exchange/" />} />
        </Routes>
      </HashRouter>
    </ThemeContext>
  );
};
