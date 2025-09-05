import React from "react";
import { Route, Routes} from "react-router-dom";

import { PrivateRoutes } from "../../../models/routes";
import Categories from "../../../components/rootPage/sections/activos/categories/Categories";
import Templates from "../../../components/rootPage/sections/activos/templates/Templates";
import Activos from "../../../components/rootPage/sections/activos/activos/Activos";
import AssetReturns from "../../../components/rootPage/sections/activos/asset-returns/AssetReturns";
import ActivosTicket from "../../../components/rootPage/sections/activos/ticket/Ticket";
import Assignment from "../../../components/rootPage/sections/activos/assignment/Assignment";


const RouteActivos: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<Activos />} />  
      <Route path={`/categories`} element={<Categories />} />
      <Route path={`/asset-returns`} element={<AssetReturns />} />
      <Route path={`/templates`} element={<Templates />} />
      <Route path={`/activos-ticket`} element={<ActivosTicket />} />
      <Route path={`/activos-assignment`} element={<Assignment />} />
    </Routes>
  );
};

export default RouteActivos;