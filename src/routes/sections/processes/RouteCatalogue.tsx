import React from "react";
import { Route, Routes} from "react-router-dom";
import Articles from "../../../components/rootPage/sections/catalogs/Articles";
import Families from "../../../components/rootPage/sections/catalogs/Families";
import Suppliers from "../../../components/rootPage/sections/catalogs/Suppliers";
import Templates from "../../../components/rootPage/sections/catalogs/templates";
import Units from "../../../components/rootPage/sections/catalogs/Units";

import { PrivateRoutes } from "../../../models/routes";


const RouteCatalogue: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.ARTICLES}`} element={<Articles />} />
      <Route path={`/${PrivateRoutes.FAMILIES}`} element={<Families/>} />
      <Route path={`/${PrivateRoutes.SUPPLIERS}`} element={<Suppliers />}/>
      <Route path={`/${PrivateRoutes.TEMPLATES}`} element={<Templates />}/>
      <Route path={`/${PrivateRoutes.UNITS}`} element={<Units />}/>

    </Routes>
  );
};

export default RouteCatalogue;