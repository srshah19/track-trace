import React, {Component} from 'react';
import data from '../data/data';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingId: props.match.params.landingId,
      noResults: false,
      data: null
    };
  }

  componentDidMount(){
    const checkResults = data.filter(number => number['booking_number'] === this.props.match.params.landingId);
    if(checkResults.length === 0){
      this.setState({
        noResults: true
      })
    } else {
      this.setState({
        data: checkResults
      })
    }
  }

  render() {
    return (
      <div>
        <h2 className="color-white">Showing results for: {this.state.landingId} </h2>
        {this.state.noResults ? <h3>No results found</h3>:
          (!this.state.data ? <p>Loading</p>:<Container data={this.state.data} /> )}
        <a href="/">Home</a>
      </div>
    )
  }
}

class Container extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      this.props.data.map((item,i) =>
        <div>
          <p className="color-white font-large">Steamship Line: {item.steamship_line}</p>
          <p className="color-white font-large">Origin: {item.origin}</p>
          <p className="color-white font-large">Destination: {item.destination}</p>
          <br />
          <h4>Containers: </h4>
        {item.containers.map((container, i ) =>
          <div className="shipping-container">
            <span key={i}>{container.number}</span>
          </div>
        )}
        </div>)
    )
  }
}

export default Results;