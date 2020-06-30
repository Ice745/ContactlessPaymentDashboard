import React from "react";
import Switch from "react-switch";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Button,
  Table,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  // Alert,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";

class Users extends React.Component {
  ws = new WebSocket('ws://192.168.1.9:8080/websocket')
  constructor(){
    super();
    this.state = {
      defaultModal: false,
      checked : false,
      users : [],
      fullName: null,
      msisdn : null,
      amount : null,
      accountType : null,
      idNumber : null,
      idType: null,
      card : null,
      ws : null
    }
    this.connect = this.connect.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.getData = this.getData.bind(this)
    this.makeThings = this.makeThings.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleChange(event){
    const target = event.target
    const value = target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
  }

  handleSubmit(event){
    // console.log(this.state)
    event.preventDefault()
    if(this.state.accountType && this.state.amount && this.state.card && this.state.fullName && this.state.idNumber && this.state.idType && this.state.msisdn != null){
      const options ={
      method : "POST",
      headers: {'Content-Type': 'application/json'},
      body : JSON.stringify({
        name : this.state.fullName,
        account : this.state.accountType,
        msisdn : this.state.msisdn,
        id_type: this.state.idType,
        id_number: this.state.idNumber, 
        balance : this.state.amount,
        userCard : this.state.card,
        currency : "GHS"
      })
    }
    console.log(options.body)
    fetch("http://localhost:8080/api/admin/register/user",options)
    .then(fdbk => fdbk.json())
    .then(out => {
      // <Alert> {out.message} </Alert>
      if (out.message === "User created"){
        this.getData()
        this.toggleModal("formModal")
        this.setState({
          fullName: null,
          msisdn : null,
          amount : null,
          accountType : null,
          idNumber : null,
          idType: null,
          card : null,
        })
      }
      else{
        alert(out.message)
      }
    })
    }else{
      alert("Provide valid input")
    }
  }

  handleSwitch(checked,id){
    this.setState({
      checked
    })
    const options = {
      method : "PUT",
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({id:id,status:"active"})
    }
    fetch("http://localhost:8080/api/admin/activate/user",options)
    .then(fdbk => fdbk.json())
    .then(out => {
      if (out.message === "Successful"){
        this.getData()
      }
    })
  }

  getData(){
    let test = []
    fetch(`http://localhost:8080/api/users/all`)
    .then(resp => resp.json())
    .then(data => {
      test = data.data;
      test.forEach(item => {
        if (item.status === "active"){
          item.status = <Badge color="" className="badge-dot">
          <i className="bg-success" />
          Active
        </Badge>
        item.switch = <Switch offColor="#d9534f" onChange={()=>this.handleSwitch(this.state.checked,item._id)} checked={!this.state.checked} disabled={true}/>
        }else{
            item.status = <Badge color="" className="badge-dot">
            <i className="bg-danger" />
            Inactive
          </Badge>
          item.switch = <Switch offColor="#d9534f" onChange={()=>this.handleSwitch(this.state.checked,item._id)} checked={this.state.checked} />
        }
      })
      this.setState({
        users : test
      })
    })
  }

  makeThings = id => {
    console.log(id)
  }

  componentDidMount(){
    this.getData()
    this.connect()    
    setInterval(() => {
      try {
        this.ws.send("hi")
        this.ws.onmessage = evt =>{
          const message = evt.data
          this.setState({
            card : message
          })
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    },1000)
  }
  timeout = 250; // Initial timeout duration as a class variable
  connect = () => {
    var ws = new WebSocket("ws://localhost:3000/ws");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
        console.log("connected websocket main component");

        this.setState({ ws: ws });
        that.timeout = 250; // reset timer to 250 on open of websocket connection 
        clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = e => {
        console.log(
            `Socket is closed. Reconnect will be attempted in ${Math.min(
                10000 / 1000,
                (that.timeout + that.timeout) / 1000
            )} second.`,
            e.reason
        );

        that.timeout = that.timeout + that.timeout; //increment retry interval
        connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = err => {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );

        ws.close();
    };
  };

/**
 * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
 */
  check = () => {
      const { ws } = this.state;
      if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };
  
  toggleModal = state => {
    this.setState({
      [state]: !this.state[state],
      fullName: "",
      msisdn : "",
      amount : "",
      accountType : "",
      idNumber : "",
      idType: "",
      card : "",
    });
  };



  render() {
    const user = this.state
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                    <Row>
                        <Col lg="10" >
                        <h3 className="text-white mt-2">Registered Users</h3>
                        </Col>
                        <Col>
                        <Button className="my-0" color="danger" type="button" onClick={() => this.toggleModal("formModal") } > Add User</Button>
                        <Modal
                          className="modal-dialog-centered"
                          size="lg"
                          isOpen={this.state.formModal}
                          toggle={() => this.toggleModal("formModal")}
                        >
                          <div className="modal-body p-0">
                            <Card className="bg-secondary shadow border-0">
                              <CardHeader className="bg-transparent pb-2">
                                <div className="text-muted text-left mt-1">
                                  <p>Register new User</p>
                                </div>
                              </CardHeader>
                              <CardBody className="px-lg-5 py-lg-5">
                                <Form noValidate role="form" onSubmit={this.handleSubmit}>
                                  <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                          <i className="ni ni-single-02" />
                                        </InputGroupText>
                                      </InputGroupAddon>
                                      <Input required placeholder="full name" type="text" name="fullName" value={user.fullName} onChange={this.handleChange} />
                                    </InputGroup>
                                  </FormGroup>
                                  <Row>
                                    <Col>
                                      <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                              <i className="ni ni-mobile-button" />
                                            </InputGroupText>
                                          </InputGroupAddon>
                                          <Input required placeholder="phone number" type="text" name="msisdn" value={user.msisdn} onChange={this.handleChange} />
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                    <Col>
                                      <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                              <i className="ni ni-folder-17" />
                                            </InputGroupText>
                                          </InputGroupAddon>
                                          <Input required type="select" name="accountType" onChange={this.handleChange} value={user.accountType} >
                                            <option>account type</option>
                                            <option value="user">user</option>
                                            <option value="merchant">merchant</option>
                                          </Input>
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col>
                                      <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                              <i className="ni ni-money-coins" />
                                            </InputGroupText>
                                          </InputGroupAddon>
                                          <Input required placeholder="amount" name="amount" value={user.amount} onChange={this.handleChange} type="text" />
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                    <Col>
                                      <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                              <i className="ni ni-credit-card" />
                                            </InputGroupText>
                                          </InputGroupAddon>
                                          <Input required placeholder="card number"  type="text" value={user.card} readOnly/>
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col>
                                      <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                              <i className="ni ni-world-2" />
                                            </InputGroupText>
                                          </InputGroupAddon>
                                          <Input required type="select" name="idType" value={user.idType} onChange={this.handleChange} id="exampleSelect">
                                            <option>id type</option>
                                            <option value="Voters">Voters</option>
                                            <option value="Passport">Passport</option>
                                            <option value="National ID">National ID</option>
                                            <option value="Dirvers">Drivers</option>
                                          </Input>
                                          {/* <Input placeholder="id type" type="text" /> */}
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                    <Col>
                                      <FormGroup>
                                        <InputGroup className="input-group-alternative">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                              <i className="ni ni-key-25" />
                                            </InputGroupText>
                                          </InputGroupAddon>
                                          <Input required placeholder="id number" name="idNumber" value={user.idNumber} onChange={this.handleChange} type="text" />
                                        </InputGroup>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  
                              
                                  <div className="text-right">
                                    <Button
                                      className="my-4"
                                      color="danger"
                                      type="submit"
                                    >
                                      Register
                                    </Button>
                                  </div>
                                </Form>
                              </CardBody>
                            </Card>
                          </div>
                        </Modal>
                        </Col>
                    </Row>
                </CardHeader>
                <Table className="align-items-center table-dark table-flush" responsive>
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Account Holder</th>
                      <th scope="col">Account Type </th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Status</th>
                      <th scope="col">Activation</th>
                      <th scope="col">Date</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {
                      user.users.map(row => (
                        <tr key={ row._id } >
                          <th scope="row"> { row.name } </th>
                          <td> { row.type } </td>
                          <td> { row.msisdn } </td>
                          <td> { row.status } </td>
                          <td> { row.switch } </td>
                          <td> { row.date } </td>
                          <td className="text-right" >
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={()=>this.makeThings(row._id)}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))
                    }                      
                  </tbody>
                </Table>
                <CardFooter className="bg-transparent py-4">
                  <nav aria-label="...">
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Users;
