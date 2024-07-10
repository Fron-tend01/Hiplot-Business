import React from "react";
import { Route, Routes} from "react-router-dom";
import Web from "../../../components/rootPage/sections/web/Web";
import { PrivateRoutes } from "../../../models/routes";

const RouteWeb: React.FC = () => {


  return (
    <Routes>
      <Route path={`${PrivateRoutes.WEB}`} element={<Web />} />
 
    </Routes>
  )
}

export default RouteWeb
