import { Route } from "react-router";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROUTES } from "../shared/config/routes";

// TODO: pages imports (implement lazy)
import Ecommerce from "../pages/Dashboard/Ecommerce";

import UserList from "../pages/Users/UserList";
import UserProfiles from "../pages/Users/UserProfiles";
import AddUser from "../pages/Users/AddUser";

import AppointmentList from "../pages/Appointments/Appointments";
import SingleAppointment from "../pages/Appointments/SingleAppointment";
import CreateAppointment from "../pages/Appointments/CreateAppointment";

import CreateInvoice from "../pages/Kanban";
import Calendar from "../pages/Calendar";

import CarList from "../pages/Cars/CarList";

import ContractorList from "../pages/Contractors/ContractorsList";

import ServiceList from "../pages/ServiceList";

import ExpenseList from "../pages/ExpensesList";

export const protectedRoutes = (
  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    <Route index path={ROUTES.ROOT} element={<Ecommerce />} />

    <Route path={ROUTES.USERS.INDEX} element={<UserList />} />
    <Route path={ROUTES.USERS.ADD_USER} element={<AddUser />} />
    <Route path={`${ROUTES.USERS.INDEX}/:userId`} element={<UserProfiles />} />

    <Route path={ROUTES.APPOINTMENTS.INDEX} element={<AppointmentList />} />
    <Route path={`${ROUTES.APPOINTMENTS.INDEX}/:appointmentId`} element={<SingleAppointment />} />
    <Route path={ROUTES.APPOINTMENTS.ADD_APPOINTMENT} element={<CreateAppointment />} />

    <Route path={ROUTES.KANBAN} element={<CreateInvoice />} />
    <Route path={ROUTES.CALENDAR} element={<Calendar />} />

    <Route path={ROUTES.CARS.INDEX} element={<CarList />} />

    <Route path={ROUTES.CONTRACTORS.INDEX} element={<ContractorList />} />

    <Route path={ROUTES.SERVICES.INDEX} element={<ServiceList />} />

    <Route path={ROUTES.EXPENSES.INDEX} element={<ExpenseList />} />
  </Route>
);
