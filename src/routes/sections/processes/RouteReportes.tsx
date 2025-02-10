import React from "react";
import { Route, Routes} from "react-router-dom";
import ExistenciaAlmacen from "../../../components/rootPage/sections/reportes/ExistenciaAlmacen";
import { PrivateRoutes } from "../../../models/routes";
import UltimosCostos from "../../../components/rootPage/sections/reportes/UltimosCostos";


const RouteReportes: React.FC = () => {
  return (
    <Routes>
      {/* <Route path='/' element={<ExistenciaAlmacen />} /> */}
      <Route path={`/${PrivateRoutes.EXISTENCIAALMACEN}`} element={<ExistenciaAlmacen />} />
      <Route path={`/${PrivateRoutes.ULTIMOSCOSTOS}`} element={<UltimosCostos />} />
    </Routes>
  );
};

export default RouteReportes;