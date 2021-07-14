import { RolLayout } from "layouts/Supervisor";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CreateSale } from "./components/CreateSale";

export function EmitSale() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <RolLayout>
        <Route exact path={path} component={CreateSale} />
      </RolLayout>
    </Switch>
  );
}
