import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import myConfig from '../config.js';
import WeekCalendar from '../components/calendars/week';
import MonthCalendar from '../components/calendars/month.jsx';
import AddComponents from '../components/addComponents';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import { fetchData } from '../api/fetchers.js';
import { checkToken } from '../api/checkToken.js';

function App() {
  // Make so App contains all of the information that is needed to render
  // This component will also handle writing the changes back to the backend

  const [editable, setEditable] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectLocation, setRedirectLocation] = useState("");

  const [views, setViews] = useState([]);
  const [viewElements, setViewElements] = useState([]);

  const [courses, setCourseMapState] = useState(new Map());
  const [events, setEventsMapState] = useState(new Map());
  const [assignments, setAssignmentsMapState] = useState(new Map());
  const [exams, setExamsMapState] = useState(new Map());
  const [projects, setProjectsMapState] = useState(new Map());

  const dataMap = (e) => {
    switch (e) {
      case 'courses':
        return courses
      case 'events':
        return events
      case 'assignments':
        return assignments
      case 'exams':
        return exams
      case 'projects':
        return projects
      default:
        throw new Error("Not allowed")
    }
  }

  const dataSetterMap = (e) => {
    switch (e) {
      case 'courses':
        return setCourseMapState
      case 'events':
        return setEventsMapState
      case 'assignments':
        return setAssignmentsMapState
      case 'exams':
        return setExamsMapState
      case 'projects':
        return setProjectsMapState
      default:
        throw new Error("Not allowed")
    }
  }

  const updateData = (table, key, value) => {
    dataSetterMap(table)(map => new Map(map.set(key, value)))
  }

  const deleteData = (table, key) => {
    let data = new Map(dataMap(table));
    data.delete(key);
    dataSetterMap(table)(data);
  }


  useEffect(() => {
    // Fetch user data from backend and display if succeeded on first render
    Promise.all([
      fetchData('views'),
      fetchData('viewelements'),
      fetchData('assignments'),
      fetchData('events'),
      fetchData('courses')]).then(e => {
        let newMap = new Map();
        for (let view of e[0]) {
          newMap.set(view.id, view);
        }
        setViews(newMap)
        newMap = new Map();
        for (let viewelement of e[1]) {
          newMap.set(viewelement.id, viewelement);
        }
        setViewElements(newMap)
        newMap = new Map();
        for (let assignment of e[2]) {
          newMap.set(assignment.id, assignment);
        }
        setAssignmentsMapState(newMap)
        newMap = new Map();
        for (let event of e[3]) {
          newMap.set(event.id, event);
        }
        setEventsMapState(newMap)
        newMap = new Map();
        for (let course of e[4]) {
          newMap.set(course.id, course);
        }
        setCourseMapState(newMap);
      })
    const cookies = new Cookies();
    if (!cookies.get('token')) {
      setRedirect(true);
      setRedirectLocation("login")
    } else {
      checkToken(cookies.get('token')).then(res => {
        if (res === false) {
          cookies.remove('token');
          setRedirect(true);
          setRedirectLocation("login");
        }
      });
    }
  }, [])
  
  const handleDelete = async (table, id) => {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
          id: id
      })
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
              console.log("2",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.success) { //Update the courses in view only if sending to database succeeded
        deleteData(table, id)
      }
    }
  }
  const handleAdd = async (table, data) => {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
          [table.slice(0,-1)]: data //Remove last character of the table
      })                            //courses -> course
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/${table}`, requestOptions)
            .catch(error => {
            console.log("3",error)
            });
    let responseJSON = await response.json()
    if (responseJSON.success) { //Update the courses in view only if sending to database succeeded
      if ('id' in data) {
        deleteData(table, data.id)
      }
      updateData(table, responseJSON.id, {...data, id: responseJSON.id});
    }
  }

  //TODO Write handlers for all data
  //TODO Change set handlers so they only accept one course and id is given in the backend

  const toggleEditable = () => {
    setEditable(!editable);
  }
  if (redirect) {
    return <Navigate to={redirectLocation} />;
  }

  let setters = {
    addCourse: (e) => handleAdd('courses', e),
    addAssignment: (e) => handleAdd('assignments', e),
    addEvent: (e) => handleAdd('events', e),
    addExam: (e) => handleAdd('exams', e),
    addProject: (e) => handleAdd('projects', e),
  };
  let deleters = {
    deleteCourse: (e) => handleDelete('courses', e),
    deleteAssingment: (e) => handleDelete('assignments', e),
    deleteEvent: (e) => handleDelete('events', e),
    deleteExam: (e) => handleDelete('exams', e),
    deleteProject: (e) => handleDelete('projects', e)
  };

  return (
    <div className="App">
      <MonthCalendar editable={editable} userData={{courses: courses, assignments: assignments, events: events, exams: exams, projects: projects}} setters={setters} deleters={deleters} sx={{x: 10, y:10, width: 815, height: 400}} />
      <WeekCalendar editable={editable} userData={{courses: courses, assignments: assignments, events: events, exams: exams, projects: projects}} setters={setters} deleters={deleters} sx={{x: 10, y:500, width: 815, height: 200}} />
      <AddComponents editable={editable} toggleEditable={toggleEditable} />
    </div>
  );
}

export default App;