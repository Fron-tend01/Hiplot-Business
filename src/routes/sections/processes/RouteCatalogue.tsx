import React from "react";
import { Route, Routes} from "react-router-dom";
import Articles from "../../../components/rootPage/sections/catalogs/Articles";
import Families from "../../../components/rootPage/sections/catalogs/Families";
import Suppliers from "../../../components/rootPage/sections/catalogs/Suppliers";
import Templates from "../../../components/rootPage/sections/catalogs/templates";
import Units from "../../../components/rootPage/sections/catalogs/Units";
import TypeOfPayment from "../../../components/rootPage/sections/catalogs/TypeOfPayment";
import Ranges from "../../../components/rootPage/sections/catalogs/Ranges";

import { PrivateRoutes } from "../../../models/routes";
import Combinations from "../../../components/rootPage/sections/catalogs/Combinations";
import Colecciones from "../../../components/rootPage/sections/catalogs/Colecciones";
import Clients from "../../../components/rootPage/sections/catalogs/Clients";
import TiemposEntrega from "../../../components/rootPage/sections/catalogs/TiemposEntrega";
import ListasFranquicias from "../../../components/rootPage/sections/catalogs/ListasFranquicias";


const RouteCatalogue: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.ARTICLES}`} element={<Articles />} />
      <Route path={`/${PrivateRoutes.FAMILIES}`} element={<Families/>} />
      <Route path={`/${PrivateRoutes.SUPPLIERS}`} element={<Suppliers />}/>
      <Route path={`/${PrivateRoutes.TEMPLATES}`} element={<Templates />}/>
      <Route path={`/${PrivateRoutes.UNITS}`} element={<Units />}/>
      <Route path={`/${PrivateRoutes.RANKS}`} element={<Ranges />}/>
      <Route path={`/${PrivateRoutes.TYPEOFPAYMENT}`} element={<TypeOfPayment />}/>
      <Route path={`/${PrivateRoutes.COMBINATIONS}`} element={<Combinations />}/>
      <Route path={`/${PrivateRoutes.COLECCIONES}`} element={<Colecciones />}/>
      <Route path={`/${PrivateRoutes.CUSTOMERS}`} element={<Clients />}/>
      <Route path={`/${PrivateRoutes.TIEMPOSENTREGA}`} element={<TiemposEntrega />}/>
      <Route path={`/${PrivateRoutes.LISTASFRANQUICIAS}`} element={<ListasFranquicias />}/>

    </Routes>
  );
};

export default RouteCatalogue;