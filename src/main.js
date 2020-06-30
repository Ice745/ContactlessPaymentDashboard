import React from "react";
import { BrowserRouter ,Switch, Route, Redirect } from 'react-router-dom'

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import { AuthProvider } from "./utils/Auth";
import PrivateRoute from "./utils/PrivateRoute";

class Main extends React.Component{


    render(){
        const page = (
            <main >
                <AuthProvider>
                    <BrowserRouter>
                        <Switch>
                            <PrivateRoute path="/admin" component={props => <AdminLayout {...props} />} />
                            <Route path="/auth" render={props => <AuthLayout {...props} />} />
                            <Redirect from="/" to="/auth/login" />  
                        </Switch>
                    </BrowserRouter> 
                </AuthProvider>
            </main>
        )
        return page 
    }
}

export default Main