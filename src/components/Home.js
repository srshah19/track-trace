import React, {Component} from 'react';
import {Route} from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParam: ''
    };
  }

  render() {
    return (
      <div>
        <label>Track a container</label>
        <br />
        <input type="text" placeholder="Enter tracking number here"
               onChange={(event) => this.setState({searchParam: event.target.value})}/>
        <br />
        <Button param={this.state.searchParam}/>
      </div>
    )
  }
}

const Button = ({param}) => (
  <Route render={({ history}) => (
    <button
      type='button'
      onClick={() => { history.push('/results/' + param) }}>
      Search
    </button>
  )} />
);

export default Home;