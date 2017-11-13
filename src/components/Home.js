import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Grid, FormGroup, FormControl, ControlLabel, HelpBlock, Row, Col} from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParam: ''
    };
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={6} className="testing">
            <FormGroup
              bsSize="lg"
              controlId="formBasicText">
              <ControlLabel className="color-white font-large">Track Container</ControlLabel>
              <FormControl
                type="text"
                bsSize="sm"
                value={this.state.value}
                placeholder="Enter booking reference number"
                onChange={(event) => this.setState({searchParam: event.target.value})}
              />
              <FormControl.Feedback/>
              <HelpBlock>You will be redirected to the results page.</HelpBlock>
              <Button param={this.state.searchParam}/>
            </FormGroup>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const Button = ({param}) => (
  <Route render={({history}) => (
    <button
      type='button' className="btn-primary"
      onClick={() => {
        history.push('/results/' + param)
      }}>
      Search
    </button>
  )}/>
);

export default Home;