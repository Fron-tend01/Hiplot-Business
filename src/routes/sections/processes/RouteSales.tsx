import React from "react";
import { Route, Routes} from "react-router-dom";
import Quotation from "../../../components/rootPage/sections/sales/Quotation";
import ArticleView from "../../../components/rootPage/sections/sales/ArticleView";
import { PrivateRoutes } from "../../../models/routes";


const RouteSales: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.QUOTATION}`} element={<ArticleView />} />  
    </Routes>
  );
};

export default RouteSales;