import React from "react";
import { Route, Routes} from "react-router-dom";
import Companies from "../../../components/rootPage/sections/processes/Companies";
import BranchOffices from "../../../components/rootPage/sections/processes/BranchOffices";
import Areas from "../../../components/rootPage/sections/processes/Areas";
import Series from "../../../components/rootPage/sections/processes/Series";
import UserGroups from "../../../components/rootPage/sections/processes/UserGroups";
import TypesUsers from "../../../components/rootPage/sections/processes/TypesUsers";
import Users from "../../../components/rootPage/sections/processes/Users";
import { PrivateRoutes } from "../../../models/routes";


const RouteProcesses: React.FC = () => {
  return (
    <Routes>
      <Route path={`/${PrivateRoutes.COMPANIES}`} element={<Companies />} />
      <Route path={`/${PrivateRoutes.BRANCHOFFCIES}`} element={<BranchOffices/>} />
      <Route path={`/${PrivateRoutes.AREAS}`} element={<Areas />}/>
      <Route path={`/${PrivateRoutes.SERIES}`} element={<Series />}/>
      <Route path={`/${PrivateRoutes.GRUPOSDEUSUARIOS}`} element={<UserGroups />}/>
      <Route path={`/${PrivateRoutes.TIPOSDEUSUARIOS}`} element={<TypesUsers />}/>
      <Route path={`/${PrivateRoutes.USUARIOS}`} element={<Users />}/>
  
    </Routes>
  );
};

export default RouteProcesses;