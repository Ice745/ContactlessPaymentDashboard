import React, { useCallback, useContext } from "react";
// import { trackPromise } from 'react-promise-tracker'
import {
  Button,
  Card,
//   CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { withRouter, Redirect  } from "react-router"
import app from "../../utils/base"
import { AuthContext } from "../../utils/Auth"

const Login = ({ history }) => {
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        // trackPromise(
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value)
        // );
        history.push("/");
      } catch (error) {
        alert(error)
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/admin/index" />;
  }

  return (
          <>
            <Col lg="5" md="7">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <small>Sign In</small>
                  </div>
                  <Form role="form" onSubmit={handleLogin}>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-single-02" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Email" name="email" type="text" autoComplete="new-email"/>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="m-r-10 ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Password" name="password" type="password" autoComplete="new-password"/>
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button className="my-4" color="primary" type="submit">
                        Sign in
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </>
        );
}

export default withRouter(Login);
