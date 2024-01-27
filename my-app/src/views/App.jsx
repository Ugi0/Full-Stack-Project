import React from 'react';
import '../styles/App.css';
import { WeekCalendar } from '../components/calendars/week';
import { AddComponents } from '../components/addComponents';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    }
  }
  toggleEditable = () => {
    this.setState({
      editable: !this.state.editable
    })
  }
  render() {
    return (
      <div className="App">
        <WeekCalendar editable={this.state.editable} />
        <AddComponents toggleEditable={this.toggleEditable} />
      </div>
    );
  }
}
