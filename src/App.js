import React from 'react';
import Main from "./containers/Main/Main";
import Login from "./containers/Auth/Login";
import Register from "./containers/Auth/Register";
import AuthGuard from "./containers/Auth/AuthGuard";

import { BrowserRouter, Route, Switch} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/auth" exact  render={ () => <AuthGuard><Login /></AuthGuard>}/>
        <Route path="/register" exact render={() => <AuthGuard><Register /></AuthGuard>}/> 
        <Route path="/" component={Main}/> 
      </Switch>
    </BrowserRouter>
  );
}

export default App;
