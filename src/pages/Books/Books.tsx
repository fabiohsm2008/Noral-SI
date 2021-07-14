import { Route, Switch, useRouteMatch } from "react-router-dom";

import { EditBook } from "./components/EditBook";
import { CreateBook } from "./components/CreateBook";
import { BooksTable } from "./components/BooksTable";

import { RolLayout } from "../../layouts/Supervisor";

export function Books() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <RolLayout>
        <Route exact path={path} component={BooksTable} />
        <Route path={`${path}/create`} component={CreateBook} />
        <Route path={`${path}/edit/:id`} component={EditBook} />
      </RolLayout>
    </Switch>
  );
}
