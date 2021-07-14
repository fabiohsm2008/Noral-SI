import { Route, Switch, useRouteMatch } from "react-router-dom";

import { KardexTable } from "./components/KardexTable";
import { CreateKardex } from "./components/CreateKardex";

import { RolLayout } from "../../layouts/Supervisor";

export function Kardex() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <RolLayout>
        <Route exact path={path} component={KardexTable} />
        <Route path={`${path}/create`} component={CreateKardex} />
      </RolLayout>
    </Switch>
  );
}
