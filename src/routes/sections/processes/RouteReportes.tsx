import React from "react";
import { Route, Routes} from "react-router-dom";
import ExistenciaAlmacen from "../../../components/rootPage/sections/reportes/ExistenciaAlmacen";
import { PrivateRoutes } from "../../../models/routes";
import UltimosCostos from "../../../components/rootPage/sections/reportes/UltimosCostos";
import WarehouseMovements from "../../../components/rootPage/sections/reportes/WarehouseMovements";
import ExistenciaPorAlmacen from "../../../components/rootPage/sections/reportes/ExistenciaPorAlmacen";
import HojasBlancas from "../../../components/rootPage/sections/reportes/HojasBlancas";
import Ventas from "../../../components/rootPage/sections/reportes/Ventas";


const RouteReportes: React.FC = () => {
  return (
    <Routes>
      {/* <Route path='/' element={<ExistenciaAlmacen />} /> */}
      <Route path={`/${PrivateRoutes.EXISTENCIAALMACEN}`} element={<ExistenciaAlmacen />} />
      <Route path={`/${PrivateRoutes.ULTIMOSCOSTOS}`} element={<UltimosCostos />} />
      <Route path={`/${PrivateRoutes.WAREHOUSEMOVEMENTS}`} element={<WarehouseMovements />} />
      <Route path={`/${PrivateRoutes.EXISTENCIAPORALMACEN}`} element={<ExistenciaPorAlmacen />} />
      <Route path={`/${PrivateRoutes.HOJASBLANCAS}`} element={<HojasBlancas />} />
      {/* <Route path={`/${PrivateRoutes.HOJASBLANCAS}`} element={<HojasBlancas />} /> */}
      <Route path={`/${PrivateRoutes.VENTAS}`} element={<Ventas />} />
    </Routes>
  );
};

export default RouteReportes;