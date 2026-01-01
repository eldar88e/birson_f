import {BrowserRouter, Routes} from "react-router";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";


export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {publicRoutes}
        {protectedRoutes}
      </Routes>
    </BrowserRouter>
  );
}
