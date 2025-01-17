import React from "react";
import { Route, Routes} from "react-router-dom";
import Production from "../../../components/rootPage/sections/production/Production";
import Vales from "../../../components/rootPage/sections/production/Vales";
import { PrivateRoutes } from "../../../models/routes";


const RouteProduction: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Production />} />
      <Route path={`/${PrivateRoutes.VALES}`} element={<Vales />} />
    </Routes>
  );
};

export default RouteProduction;