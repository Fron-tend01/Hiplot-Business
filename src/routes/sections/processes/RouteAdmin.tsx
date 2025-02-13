import React from "react";
import { Route, Routes} from "react-router-dom";
import { PrivateRoutes } from "../../../models/routes";
import Billing from "../../../components/rootPage/sections/sales/Billing";
import CobrosFranquicia from "../../../components/rootPage/sections/admin/CobrosFranquicia";


const RouteAdmin: React.FC = () => {
  return (
    <Routes>
      {/* <Route path='/' element={<ExistenciaAlmacen />} /> */}
      <Route path={`/${PrivateRoutes.BILLING}`} element={<Billing />} />
      <Route path={`/${PrivateRoutes.COBROS_A_FRANQUICIA}`} element={<CobrosFranquicia />} />
    </Routes>
  );
};

export default RouteAdmin;