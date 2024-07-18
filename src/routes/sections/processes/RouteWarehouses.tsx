import React from "react";
import { Route, Routes} from "react-router-dom";
import Store from "../../../components/rootPage/sections/store/Store";
import Tickets from "../../../components/rootPage/sections/store/Tickets";
import Departures from "../../../components/rootPage/sections/store/Departures";
import Orders from "../../../components/rootPage/sections/store/Orders";
import Transfers from "../../../components/rootPage/sections/store/Transfers";
import { PrivateRoutes } from "../../../models/routes";


const RouteWarehouses: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.STORE}`} element={<Store />} />
      <Route path={`${PrivateRoutes.TICKETS}`} element={<Tickets />} />
      <Route path={`${PrivateRoutes.DEPARTURES}`} element={<Departures />} />
      <Route path={`${PrivateRoutes.ORDERS}`} element={<Orders />} />
      <Route path={`${PrivateRoutes.TRANSFERS}`} element={<Transfers />} />
    </Routes>
  );
};

export default RouteWarehouses;