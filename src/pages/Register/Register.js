import React from "react";

// reactstrap components
import {
  Button,
  Card,
  // CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Modal,
  CardHeader
} from "reactstrap";

class Register extends React.Component {
  ws = new WebSocket('ws://192.168.1.9:8080/websocket')
  constructor(){
    super();
    this.state={
      defaultModal: false,
      checked : false,
      uneditable: true, 
      holder : null,
      payer : null,
      amount : null,
      pinNumber : null,
      payPin : null,
      cardDetails : null
    }
    this.connect = this.connect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.read = this.read.bind(this)
    this.payup = this.payup.bind(this)
  }

  toggleModal = state => {
    this.read()
    this.setState({
      [state]: !this.state[state],
      payPin : null,
      uneditable: true
    });
  };

  handleChange(event){
    const target = event.target
    const value = target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
  }

  payup(event){
    event.preventDefault();
    if(this.state.payPin && this.state.cardDetails !== null){
      const options = {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          userCard : this.state.cardDetails,
          userPIN : this.state.payPin,
        })
      }
      fetch("http://localhost:8080/api/users/request/transfer",options)
      .then(fdbk => fdbk.json())
      .then(out => {
        if(out.message === "Successful"){
          this.setState({
            cardDetails : null,
            payPin : null
          })
          window.location.reload()
          alert(`${out.message}`)
        }else{
          alert(out.message)
        }
      } 
    )}
  }

  handleSubmit(event){
    event.preventDefault();
    if(this.state.amount && this.state.holder && this.state.payer && this.state.pinNumber !== null){
      const options = {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          amount : this.state.amount,
          currency :"GHS",
          payer : {
            partyIdType: "MSISDN",
            partyId: this.state.payer
          },
          accountHolder : this.state.holder,
          securityPin : this.state.pinNumber
        })
      }
      fetch("http://localhost:8080/api/merchants/request/payment",options)
      // .then(fdbk => fdbk.json())
      .then(out => {
        if(out.status === 202){
          this.setState({
            holder : null,
            payer : null,
            amount : null,
            pinNumber : null
          })
          window.location.reload()
          alert("Request made successfully")
        }else{
          alert(out.message)
        }
      } 
    )}
  }

  read(){
    // setInterval(() => {
      try {
        this.ws.send("hi")
        this.ws.onmessage = evt =>{
          const message = evt.data
          this.setState({
            cardDetails : message,
            uneditable : false
          })
          console.log(message)
        }
      } catch (error) {
        console.log(error)
      }
    // },1000)
  }

  componentDidMount(){
    this.connect()    
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

  render() {
    const req = this.state
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <h1>Request Payment</h1>
              </div>
              <Form role="form" onSubmit={this.handleSubmit}>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Account holder" type="text" name="holder" onChange={this.handleChange} value={req.holder} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Payer" type="text" name="payer" onChange={this.handleChange} value={req.payer}  />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-money-coins" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Amount" type="text" name="amount" onChange={this.handleChange} value={req.amount} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="PIN" type="password" autoComplete="new-password" name="pinNumber" onChange={this.handleChange} value={req.pinNumber} />
                  </InputGroup>
                </FormGroup>
                <Row>
                  <div className="text-center">
                    <Button className="mt-4 ml-3 mr-6" color="primary" type="submit">
                      Request
                    </Button>
                  </div>
                  <div className="text-center">
                    <Button className="mt-4 ml-9" color="danger" type="button" onClick={() => this.toggleModal("formModal") }>
                      Payment
                    </Button>
                  </div>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Modal
          className="modal-dialog-centered"
          size="md"
          isOpen={this.state.formModal}
          toggle={() => this.toggleModal("formModal")}
        >
        <div className="modal-body p-0">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent pb-2">
              <div className="text-muted text-left mt-1">
                <p>Confirm Payment</p>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="mb-5">
                <h4>Tap Card on reader and enter pin to confirm</h4>
              </div>
              <Form noValidate role="form" onSubmit={this.payup}>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Enter PIN to confirm" type="password" name="payPin" onChange={this.handleChange} value={req.payPin} readOnly={req.uneditable} />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="mt-4 ml-3 mr-6" color="primary" type="submit">
                  Confirm
                </Button>
              </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      </Modal>
      </>
    );
  }
}

export default Register;
