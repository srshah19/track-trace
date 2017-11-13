import React, {Component} from 'react';
import {
  Grid, Col, Row, Thumbnail, Button, Jumbotron, Glyphicon, OverlayTrigger, Tooltip, Nav,
  NavItem, Modal, Collapse, Well
} from 'react-bootstrap';
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

// Project imports
import data from '../data/data';
import containerImage from '../container.png';


// Simple bootstrap tooltip
const tooltip = (
  <Tooltip id="tooltip">
    Click this icon to copy the share URL.
  </Tooltip>
);


/**
 * Results class which handles routing, saving search and overall data construction
 * for Container class to use.
 */
class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingId: props.match.params.landingId, //We pass the booking reference as a param ID
      noResults: false, //State to keep track if no results are found
      data: null,
      copied: false,
      value: window.location.href || props.location.pathname // Used to share the current URL
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
      // localStorage only stores strings. parsing to arr and stringify for storing.
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
      // If the searches is not stored, create a new Array and store in local.
      localStorage.setItem('searches', JSON.stringify([this.state.landingId]));
      toast('This booking number has been saved to search');
    }
  }

  /**
   * Simple message notification library
   * param: {message}: The message to be displayed.
   */
  notify = (message) => toast(message);

  render() {
    return (
      <div>
        <div className="navigation-bar">
          {/* Bootstrap menu bar */}
          <Nav bsStyle="pills" activeKey={2}>
            <NavItem eventKey={1} href="/">Home</NavItem>
            <NavItem eventKey={2} title="Results">Results</NavItem>
            {/* #TODO: Maybe add an option here itself to remove if search is saved? */}
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

/**
 * Container class handles showing the booking reference along with the containers
 * params: {data}: required to construct the UI
 * #TODO: If data is null, handle it.
 */
class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Grid>
        {/* We map the entire data to create the booking details, containers and updates */}
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
                  {/* Vessel/ETA information is based on the container. I am finding the farthest eta date
                   and using that to populate these fields */}
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
                  <ContainerUpdate container={container} updates={item.updates}/>
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
      open: false,
      updates: null
    };
  }

  componentDidMount(){
    // We send the update object, filter out the objects that don't match the current container number.
    const updates = this.props.updates.filter((item, i) => item.container_number === this.props.container.number);
    this.setState({
      updates: updates
    })
  }

  render() {
    return (
      <Col xs={6} md={4}>
        <Thumbnail src={containerImage} alt="242x200" className="container-img">
          <h5><strong>Container Number:</strong> {this.props.container.number}</h5>
          <p><strong>Size:</strong> {this.props.container.size}</p>
          <p><strong>Type:</strong> {this.props.container.type}</p>
          <p><strong>Current Location:</strong> {this.props.container.location}</p>
          <p><strong>Last Status at:</strong> {new Date(this.props.container.last_status_at).toLocaleString()}</p>
          <p><strong>Last Status:</strong> {this.props.container.last_status}</p>
          <Button bsStyle="primary" data-number={this.props.container.number}
                  onClick={() => this.setState({open: !this.state.open})}>Trace</Button>&nbsp;
          <Collapse in={this.state.open}>
            <div>
              {/* Container Updates */}
              {this.state.updates === null ? '' : (this.state.updates.map((update, i) =>
                  <Well>
                    <p><strong>Container Number:</strong> {update.container_number}</p>
                    <p><strong>Vessel:</strong> {update.vessel}</p>
                    <p><strong>Voyage:</strong> {update.voyage}</p>
                    <p><strong>Vessel Eta:</strong> {new Date(update.vessel_eta).toLocaleString()}</p>
                  </Well>
                ))}
            </div>
          </Collapse>
        </Thumbnail>
      </Col>
    )
  }
}

export default Results;