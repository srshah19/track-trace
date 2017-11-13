import React, {Component} from 'react';
import {
  Grid, Col, Row, Thumbnail, Button, Jumbotron, Glyphicon, OverlayTrigger, Tooltip, Nav,
  NavItem
} from 'react-bootstrap';
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

// Project imports
import data from '../data/data';
import containerImage from '../container.png';

const tooltip = (
  <Tooltip id="tooltip">
    Click this icon to copy the share URL.
  </Tooltip>
);


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
    // Once component is mounted, search the mock data to get the object matching the booking reference number
    // This will later turn into a fetch request to pull data from the pilship.com API
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

  saveSearch() {
    let arr;
    // Currently using localStorage for storing search history.
    // Ideally search history needs to be stored in DB.
    if (localStorage.getItem('searches')) {
      arr = JSON.parse(localStorage.getItem('searches'));
      if (arr.indexOf(this.state.landingId) === -1) {
        arr.push(this.state.landingId);
      } else {
        return toast.error('This search is already saved. ' +
          'If you want to remove, please go back to home and remove.');
      }
      localStorage.setItem('searches', JSON.stringify(arr));
      toast('This booking number has been saved to search');
    } else {
      localStorage.setItem('searches', JSON.stringify([this.state.landingId]));
      toast('This booking number has been saved to search');
    }
  }

  notify = (message) => toast(message);

  render() {
    return (
      <div>
        <div className="navigation-bar">
          <Nav bsStyle="pills" activeKey={2}>
            <NavItem eventKey={1} href="/">Home</NavItem>
            <NavItem eventKey={2} title="Results">Results</NavItem>
            <NavItem eventKey={3} title="Save Search" onClick={this.saveSearch.bind(this)}>Save Search</NavItem>
          </Nav>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        {/*<a href="/"><Glyphicon glyph="arrow-left"/>Home</a>*/}
        <h3 className="">Showing results for: {this.state.landingId}
          <CopyToClipboard text={this.state.value}
                           onCopy={() => this.setState({copied: true})}>
            <OverlayTrigger placement="top" overlay={tooltip}>
              <span className="m-l-2 glyphicon glyphicon-share-alt"
                    onClick={() => this.notify("URL has been copied to clipboard.")}/>
            </OverlayTrigger>
          </CopyToClipboard>
        </h3>
        {this.state.noResults ? <h3>No results found</h3> :
          (!this.state.data ? <p>Loading</p> : <Container data={this.state.data}/> )}
      </div>
    )
  }
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTrace: false
    }
  }

  fetchContainerInfo(event) {
    console.log(event.target.getAttribute('data-number'));
    return (
      <ContainerUpdate/>
    )
  }

  render() {
    return (
      <Grid>
        {this.props.data.map((item, i) =>
          <Row className="show-grid" key={i}>
            <Jumbotron>
              <Row>
                <Col sm={6}>
                  <p className="font-large">
                    <strong>B/L Number:</strong> {item.booking_number}</p>
                  <p className="font-large">
                    <strong>Steamship Line:</strong> {item.steamship_line}</p>
                  <p className="font-large">
                    <strong>Origin:</strong> {item.origin}</p>
                  <p className="font-large">
                    <strong>Destination:</strong> {item.destination}</p>
                </Col>
                <Col sm={6}>
                  <p className="font-large">
                    <strong>Vessel ETA:</strong> {new Date(Math.max.apply(null, item.updates.map(function (e) {
                    return new Date(e.vessel_eta);
                  }))).toDateString()}</p>
                  <p className="font-large">
                    <strong>Vessel:</strong> {item.updates[0]['vessel']}</p>
                  <p className="font-large">
                    <strong>Voyage:</strong> {item.updates[0]['voyage']}</p>
                </Col>
              </Row>
            </Jumbotron>
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
                      <p>Last Status at: {new Date(container.last_status_at).toLocaleString()}</p>
                      <p>Last Status: {container.last_status}</p>
                      <Button bsStyle="primary" data-number={container.number}
                              onClick={(val) => this.fetchContainerInfo(val)}>Trace</Button>&nbsp;
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

class ContainerUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      object: props.data
    }
  }

  render() {
    return (
      <p>Hello</p>
    )
  }
}

export default Results;