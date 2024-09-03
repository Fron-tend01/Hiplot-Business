import React from "react";
import { Route, Routes} from "react-router-dom";
import Production from "../../../components/rootPage/sections/production/Production";
import { PrivateRoutes } from "../../../models/routes";


const RouteProduction: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Production />} />
    </Routes>
  );
};

export default RouteProduction;