import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {
  Grid, FormGroup, FormControl, ControlLabel, HelpBlock, Row, Col, NavDropdown, MenuItem,
  Glyphicon, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import {ToastContainer, toast} from "react-toastify";


const tooltip = (
  <Tooltip id="tooltip">
    Click this icon to remove this search from saved history
  </Tooltip>
);


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParam: '',
      savedSearches: JSON.parse(localStorage.getItem('searches')) || []
    };
  }

  removeFromSaved(val) {
    let arr;
    if (localStorage.getItem('searches')) {
      arr = JSON.parse(localStorage.getItem('searches'));
      arr.splice(arr.indexOf(val), 1);
      localStorage.setItem('searches', JSON.stringify(arr));
      this.setState({
        savedSearches: arr
      })
    } else {
      localStorage.removeItem('searches')
    }
  }

  removeAll() {
    localStorage.removeItem('searches');
    this.setState({
      savedSearches: []
    });
    toast.success('Removed all searches from saved history')
  }

  render() {
    return (
      <Grid>
        <Row>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
          <Col sm={6} className="absolute-pos">
            <FormGroup
              bsSize="lg"
              controlId="formBasicText">
              <Col sm={6}>
                <ControlLabel className="color-white font-large">Track Container</ControlLabel>
              </Col>
              <Col sm={6}>
                <NavDropdown eventKey="4" className="pull-right saved-searches"
                             title="Saved Searches" id="nav-dropdown">
                  {this.state.savedSearches.length === 0 ? <MenuItem disabled={true}>No saved searches</MenuItem> :
                    (this.state.savedSearches.map((search, i) =>
                      <MenuItem key={i} eventKey={i}
                                onClick={(event) => this.setState({searchParam: event.target.innerText})}>
                        {search}
                        <span data-name={search} className="pull-right text-right"
                              onClick={(search) => this.removeFromSaved(search)}>
                        <OverlayTrigger placement="top" overlay={tooltip}>
                        <Glyphicon glyph="remove"/>
                        </OverlayTrigger>
                      </span>
                      </MenuItem>))}
                  {this.state.savedSearches.length > 0 ? (<div><MenuItem divider/>
                    <MenuItem className="text-center" onClick={this.removeAll.bind(this)}>Remove All</MenuItem>
                  </div>) : ''}
                </NavDropdown>
              </Col>
              <FormControl
                type="text"
                bsSize="sm"
                value={this.state.searchParam}
                placeholder="Enter booking reference number"
                onChange={(event) => this.setState({searchParam: event.target.value})}
              />
              <FormControl.Feedback/>
              <HelpBlock>You will be redirected to the results page.</HelpBlock>
              <Button disabled={this.state.searchParam.length === 0} param={this.state.searchParam}/>
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const Button = ({disabled, param}) => (
  <Route render={({history}) => (
    <button
      type='button' className="btn-primary"
      disabled={disabled}
      onClick={() => {
        history.push('/bookings/' + param)
      }}>
      Search
    </button>
  )}/>
);

export default Home;