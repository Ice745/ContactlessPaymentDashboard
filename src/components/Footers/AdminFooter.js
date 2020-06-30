import React from "react";

// reactstrap components
import { Row, Col} from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              <b>© 2020 Isaac Owusu </b>
            </div>
          </Col>
        </Row>
      </footer>
    );
  }
}

export default Footer;
