import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import myConfig from '../config.js';
import WeekCalendar from '../components/calendars/week';
import MonthCalendar from '../components/calendars/month.jsx';
import AddComponents from '../components/addComponents';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import { fetchCourses, fetchAssignments, fetchEvents, fetchViews, fetchViewElements } from '../api/fetchers.js';

function App() {
  // Make so App contains all of the information that is needed to render
  // This component will also handle writing the changes back to the backend

  const [editable, setEditable] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectLocation, setRedirectLocation] = useState("");

  const [views, setViews] = useState([]);
  const [viewElements, setViewElements] = useState([]);

  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [assingments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch user data from backend and display if succeeded on first render
    fetchViews(setViews);
    fetchViewElements(setViewElements);
    fetchAssignments(setAssignments);
    fetchEvents(setEvents);
    fetchCourses(setCourses);
  }, [])
  
  const deleteCourse = async (courseid) => {
    const cookies = new Cookies();
    const NewCourses = courses.filter((e) => e.courseid !== courseid);
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
          courseid: courseid
      })
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
              console.log("2",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.success) { //Update the courses in view only if sending to database succeeded
        setCourses(NewCourses);
      }
    }
  }
  const handleSetCourses = async (newCourses) => {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
          courses: newCourses
      })
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
            console.log("3",error)
            });
    let responseJSON = await response.json()
    if (responseJSON.success) { //Update the courses in view only if sending to database succeeded
      setCourses(newCourses)
    }
  }

  const toggleEditable = () => {
    setEditable(!editable);
  }

  const cookies = new Cookies();
  if (!cookies.get('token')) {
    setRedirect(true);
    setRedirectLocation("login")
    return <Navigate to={redirectLocation} />;
  }

  return (
    <div className="App">
      <MonthCalendar editable={editable} courses={courses} setCourses={handleSetCourses} deleteCourse={deleteCourse} sx={{x: 10, y:10, width: 815, height: 400}} />
      <WeekCalendar editable={editable} courses={courses} setCourses={handleSetCourses} deleteCourse={deleteCourse} sx={{x: 10, y:500, width: 815, height: 200}} />
      <AddComponents editable={editable} toggleEditable={toggleEditable} />
    </div>
  );
}

export default App;