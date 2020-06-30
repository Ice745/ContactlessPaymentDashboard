import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "../../components/Headers/Header.js";

class Transactions extends React.Component {
  constructor(){
    super();
    this.state = {
      transactions : [],
    }
    this.getData = this.getData.bind(this)
  }

  getData(){
    let test = []
    fetch(`http://localhost:8080/api/admin/transactions/user`)
    .then(resp => resp.json())
    .then(data => {
      test = data.data;
      test.forEach(item => {
        if (item.status === "payment successful"){
          item.status = <Badge color="" className="badge-dot">
          <i className="bg-success" />
          Complete
        </Badge>
        } else if (item.status === "pending payment"){
          item.status = <Badge color="" className="badge-dot">
          <i className="bg-warning" />
          Pending
        </Badge>
        }else{
            item.status = <Badge color="" className="badge-dot">
            <i className="bg-danger" />
            Failed
          </Badge>
        }
      })
      this.setState({
        transactions : test
      })

    })
  }

  componentDidMount(){
    this.getData()
  }

  render() {
    const data = this.state
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
                  <h3 className="text-white mb-0">Transactions</h3>
                </CardHeader>
                <Table className="align-items-center table-dark table-flush" responsive>
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Payee</th>
                      <th scope="col">Payer</th>
                      <th scope="col">Currency</th>
                      <th scope="col">Status</th>
                      <th scope="col">Date</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.transactions.map(row => (
                        <tr key={row._id}>
                          <th scope="row"> { row.transactionId } </th>
                          <td> { row.sender } </td>
                          <td> { row.reciepient } </td>
                          <td> { row.currency } {row.amount} </td>
                          <td> { row.status } </td>
                          <td> { row.date } </td>
                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={() => console.log(row._id)}
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

export default Transactions;
