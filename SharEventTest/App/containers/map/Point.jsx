import React, { Component } from 'react';


class Point extends Component {
  
  removePoint(e) {
    this.props.removePoint(this.props.id);
  }

  render() {
    return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
                <td><div className="point__remove" onClick={this.removePoint.bind(this)}>✘</div></td>
            </tr>
    )
  }
}

export default Point;
