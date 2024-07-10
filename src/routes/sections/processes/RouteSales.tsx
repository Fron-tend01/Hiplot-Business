import React from "react";
import { Route, Routes} from "react-router-dom";
import Requisition from "../../../components/rootPage/sections/sales/Requisition";
import PurchaseOrders from "../../../components/rootPage/sections/sales/PurchaseOrders";
import { PrivateRoutes } from "../../../models/routes";


const RouteSales: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.REQUISITION}`} element={<Requisition />} />
      <Route path={`/${PrivateRoutes.PURCHASEORDERS}`} element={<PurchaseOrders />} />

  
    </Routes>
  );
};

export default RouteSales;