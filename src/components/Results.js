import React, {Component} from 'react';
import {Grid, Col, Row, Thumbnail, Button} from 'react-bootstrap';
import data from '../data/data';
import containerImage from '../container.png';
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingId: props.match.params.landingId,
      noResults: false,
      data: null,
      copied: false,
      value: window.location.href || props.location.pathname
    };
  }

  componentDidMount() {
    const checkResults = data.filter(number => number['booking_number'] === this.props.match.params.landingId);
    if (checkResults.length === 0) {
      this.setState({
        noResults: true
      })
    } else {
      this.setState({
        data: checkResults
      })
    }
  }

  notify = () => toast("URL has been copied to clipboard");

  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <a href="/">Home</a>
        <h2 className="color-white">Showing results for: {this.state.landingId}
          <CopyToClipboard text={this.state.value}
                           onCopy={() => this.setState({copied: true})}>
            <span className="m-l-2 glyphicon glyphicon-share-alt" onClick={this.notify}/>
          </CopyToClipboard>
        </h2>
        {this.state.noResults ? <h3>No results found</h3> :
          (!this.state.data ? <p>Loading</p> : <Container data={this.state.data}/> )}
      </div>
    )
  }
}

class Container extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid>
        {this.props.data.map((item, i) =>
          <Row className="show-grid" key={i}>
            <p className="color-white font-large">Steamship Line: {item.steamship_line}</p>
            <p className="color-white font-large">Origin: {item.origin}</p>
            <p className="color-white font-large">Destination: {item.destination}</p>
            <br/>
            <h4>Containers: </h4>
            <Grid>
              <Row>
                {item.containers.map((container, i) =>
                  <Col xs={6} md={4} key={i}>
                    <Thumbnail src={containerImage} alt="242x200" className="container-img">
                      <h5>Container Number: <strong>{container.number}</strong></h5>
                      <p>Size: {container.size}</p>
                      <p>Type: {container.type}</p>
                      <p>Current Location: {container.location}</p>
                      <p>Last Status at: {container.last_status_at}</p>
                      <p>Last Status: {container.last_status}</p>
                      <p>
                        <Button bsStyle="primary">Show Updates</Button>&nbsp;
                        <Button bsStyle="default">Hide Updates</Button>
                      </p>
                    </Thumbnail>
                  </Col>
                )}
              </Row>
            </Grid>
          </Row>)}
      </Grid>
    )
  }
}

export default Results;