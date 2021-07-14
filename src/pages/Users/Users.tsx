import { Route, useRouteMatch } from "react-router-dom";

import { EditUser } from "./components/EditUser";
import { UsersTable } from "./components/UsersTable";
import { RolLayout } from "../../layouts/Supervisor";
import { CreateUser } from "./components/CreateUser";

export function Users() {
  const { path } = useRouteMatch();

  return (
    <RolLayout>
      <Route exact path={path} component={UsersTable} />
      <Route path={`${path}/create`} component={CreateUser} />
      <Route path={`${path}/edit/:id`} component={EditUser} />
    </RolLayout>
  );
}
