import React from "react";
import { Route, Routes} from "react-router-dom";
import Requisition from "../../../components/rootPage/sections/shopping/Requisition";
import PurchaseOrders from "../../../components/rootPage/sections/shopping/PurchaseOrders";
import { PrivateRoutes } from "../../../models/routes";


const RouteShopping: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.REQUISITION}`} element={<Requisition />} />
      <Route path={`/${PrivateRoutes.PURCHASEORDERS}`} element={<PurchaseOrders />} />
    </Routes>
  );
};

export default RouteShopping;