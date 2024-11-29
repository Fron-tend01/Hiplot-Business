import React from "react";
import { Route, Routes} from "react-router-dom";
import Quotation from "../../../components/rootPage/sections/sales/Quotation";
import SalesOrder from "../../../components/rootPage/sections/sales/SalesOrder";
import Billing from "../../../components/rootPage/sections/sales/Billing";
import { PrivateRoutes } from "../../../models/routes";


const RouteSales: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.QUOTATION}`} element={<Quotation />} />
      <Route path={`/${PrivateRoutes.SALESORDER}`} element={<SalesOrder />} />
      <Route path={`/${PrivateRoutes.BILLING}`} element={<Billing />} />  
    </Routes>
  );
};

export default RouteSales;