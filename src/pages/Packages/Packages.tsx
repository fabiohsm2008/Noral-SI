import { Route, Switch, useRouteMatch } from "react-router-dom";

import { PackagesTable } from "./components/PackagesTable";
import { CreatePack } from "./components/CreatePack";
import { EditPack } from "./components/EditPack";

import { RolLayout } from "../../layouts/Supervisor";

export function Packages() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <RolLayout>
        <Route exact path={path} component={PackagesTable} />
        <Route path={`${path}/create`} component={CreatePack} />
        <Route path={`${path}/edit/:id`} component={EditPack} />
      </RolLayout>
    </Switch>
  );
}
