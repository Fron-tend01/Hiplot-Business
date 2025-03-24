import React from "react";
import { Route, Routes} from "react-router-dom";
import Dashboard from "../../../pages/Private/Dashboard/Dashboard";


const RouteDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
    </Routes>
  );
};

export default RouteDashboard;