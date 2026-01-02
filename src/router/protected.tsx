import { Route } from "react-router";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROUTES } from "../shared/config/routes";

// TODO: pages imports (implement lazy)
import Ecommerce from "../pages/Dashboard/Ecommerce";

import UserList from "../pages/Users/UserList";
import UserProfiles from "../pages/Users/UserProfiles";
import AddUser from "../pages/Users/AddUser";

import ProductList from "../pages/Ecommerce/ProductList";
import AddProduct from "../pages/Ecommerce/AddProduct";

import AppointmentList from "../pages/Ecommerce/Appointments";
import SingleAppointment from "../pages/Ecommerce/SingleAppointment";
import CreateAppointment from "../pages/Ecommerce/CreateAppointment";

import CreateInvoice from "../pages/Kanban";
import Calendar from "../pages/Calendar";

export const protectedRoutes = (
  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    <Route index path={ROUTES.ROOT} element={<Ecommerce />} />

    <Route path={ROUTES.USERS.INDEX} element={<UserList />} />
    <Route path={ROUTES.USERS.ADD_USER} element={<AddUser />} />
    <Route path={`${ROUTES.USERS.INDEX}/:userId`} element={<UserProfiles />} />

    <Route path={ROUTES.PRODUCTS.INDEX} element={<ProductList />} />
    <Route path={ROUTES.PRODUCTS.ADD_PRODUCT} element={<AddProduct />} />

    <Route path={ROUTES.APPOINTMENTS.INDEX} element={<AppointmentList />} />
    <Route path={`${ROUTES.APPOINTMENTS.INDEX}/:appointmentId`} element={<SingleAppointment />} />
    <Route path={ROUTES.APPOINTMENTS.ADD_APPOINTMENT} element={<CreateAppointment />} />

    <Route path={ROUTES.KANBAN} element={<CreateInvoice />} />
    <Route path={ROUTES.CALENDAR} element={<Calendar />} />
  </Route>
);
