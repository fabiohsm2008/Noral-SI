import { RolLayout } from "layouts/Supervisor";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { SalesTable } from "./components/SalesTables";

export function Sales() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <RolLayout>
        <Route exact path={path} component={SalesTable} />
      </RolLayout>
    </Switch>
  );
}
