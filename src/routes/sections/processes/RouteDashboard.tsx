import React from "react";
import { Route, Routes} from "react-router-dom";
import { PrivateRoutes } from "../../../models/routes";
import Billing from "../../../components/rootPage/sections/sales/Billing";
import Dashboard from "../../../pages/Private/Dashboard/Dashboard";


const RouteDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
    </Routes>
  );
};

export default RouteDashboard;