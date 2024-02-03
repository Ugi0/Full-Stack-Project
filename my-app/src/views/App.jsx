import React from 'react';
import '../styles/App.css';
import myConfig from '../config.js';
import { WeekCalendar } from '../components/calendars/week';
import { MonthCalendar } from '../components/calendars/month.jsx';
import { AddComponents } from '../components/addComponents';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

export default class App extends React.Component {
  // Make so App contains all of the information that is needed to render
  // This component will also handle writing the changes back to the backend

  constructor(props) {
    super(props);
    this.state = {
      editable: false, redirect: false, redirectLocation: "",
      courses: []
    };
    this.events = [];
  }

  componentDidMount = async () => {
    // Fetch user data from backend and display if succeeded
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
                console.log(error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        this.setState({courses: responseJSON.data})
      }
    }
  }
  deleteCourse = async (courseid) => {
    const cookies = new Cookies();
    const courses = this.state.courses.filter((e) => e.courseid !== courseid);
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
          courseid: courseid
      })
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
                console.log(error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.success) { //Update the courses in view only if sending to database succeeded
        this.setState({
          courses: courses
        })
      }
    }
  }
  setCourses = async (courses) => {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
          courses: courses
      })
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
                console.log(error)
            });
    let responseJSON = await response.json()
    if (responseJSON.success) { //Update the courses in view only if sending to database succeeded
      this.setState({
        courses: courses
      })
    }
  }

  toggleEditable = () => {
    this.setState({
      editable: !this.state.editable
    })
  }

  render() {
    const cookies = new Cookies();
    if (!cookies.get('token')) {
      this.setState({ //Make window redirect
        redirect: true,
        redirectLocation: "/login"
      });
      return <Navigate to={this.state.redirectLocation} />;
    }

    return (
      <div className="App">
        <MonthCalendar editable={this.state.editable} courses={this.state.courses} setCourses={this.setCourses} deleteCourse={this.deleteCourse} sx={{x: 10, y:10, width: 815, height: 400}} />
        <WeekCalendar editable={this.state.editable} courses={this.state.courses} setCourses={this.setCourses} deleteCourse={this.deleteCourse} sx={{x: 10, y:800, width: 815, height: 200}} />
        <AddComponents editable={this.state.editable} toggleEditable={this.toggleEditable} />
      </div>
    );
  }
}
