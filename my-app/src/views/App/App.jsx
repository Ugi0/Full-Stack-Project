import React, { useEffect, useState, createRef, useRef } from 'react';
import './App.css';
import myConfig from '../../config.js';
import WeekCalendar from '../../view_elements/calendars/week/week.jsx'
import MonthCalendar from '../../view_elements/calendars/month/month.jsx'
import DayCalendar from '../../view_elements/calendars/day/day.jsx'
import CoursesView from '../../view_elements/courses/coursesView/coursesView.jsx'
import AddComponents from '../../components/addComponents/addComponents.jsx';
import Navigation from '../../components/navigation/Navigation.jsx';
import Banner from '../../components/banner/banner.jsx';
import Divider from '../../components/divider/Divider.jsx';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import { fetchData } from '../../api/fetchers.js';
import { checkToken } from '../../api/checkToken.js';
import { fetchViewData } from '../../api/fetchViewData.js';
import { saveViewElement, deleteViewElement } from '../../api/saveViewElement.js';
import { defaultViewSize } from '../../api/defaultViewSizes.js';

function App() {
  // Make so App contains all of the information that is needed to render
  // This component will also handle writing the changes back to the backend

  const [editable, setEditable] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectLocation, setRedirectLocation] = useState("");

  const [views, setViews] = useState(new Map());
  const [viewElements, setViewElements] = useState(new Map());
  const [selectedView, setSelectedView] = useState(0);

  const [courses, setCourseMapState] = useState(new Map());
  const [events, setEventsMapState] = useState(new Map());
  const [assignments, setAssignmentsMapState] = useState(new Map());
  const [exams, setExamsMapState] = useState(new Map());
  const [projects, setProjectsMapState] = useState(new Map());

  const chooseComponent = (item, index) => {
    switch (item.type) {
      case 0:
        if (item.size === 2) return <MonthCalendar id={item.id} deleteComponent={deleteComponent} innerRef={item.ref} key={index} handleAdd={handleAdd} handleDelete={handleDelete} editable={editable} userData={{courses: courses, assignments: assignments, events: events, exams: exams, projects: projects}} sx={{x: item.x, y:item.y, width: item.width, height: item.height}} />
        if (item.size === 1) return <WeekCalendar id={item.id} deleteComponent={deleteComponent} innerRef={item.ref} key={index} handleAdd={handleAdd} handleDelete={handleDelete} editable={editable} userData={{courses: courses, assignments: assignments, events: events, exams: exams, projects: projects}} sx={{x: item.x, y:item.y, width: item.width, height: item.height}} />
        break;
      default:
        throw new Error("Not a valid component")
    }
  }

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
      case 'views':
        return views
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
      case 'views':
        return setViews
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
      fetchData('assignments'),
      fetchData('events'),
      fetchData('courses')]).then(e => {
        if (e === undefined || e[0] === undefined) return;
        let newMap = new Map();
        e[0].sort((a,b) => a.title.localeCompare(b.title))
        for (let view of e[0]) {
          view.type = "view";
          if (view.title === '_mainpage') {
            updateSelectedView(view.id)
          }
          newMap.set(view.id, view);
        }
        setViews(newMap)
        newMap = new Map();
        for (let assignment of e[1]) {
          assignment.type = "assignments";
          newMap.set(assignment.id, assignment);
        }
        setAssignmentsMapState(newMap)
        newMap = new Map();
        for (let event of e[2]) {
          event.type = "events";
          newMap.set(event.id, event);
        }
        setEventsMapState(newMap)
        newMap = new Map();
        for (let course of e[3]) {
          course.type = "courses";
          newMap.set(course.id, course);
        }
        setCourseMapState(newMap);
        const cookies = new Cookies();
        let result = fetchViewData(0, cookies.get('token'))
        newMap = new Map();
        newMap.set(0, result.data ?? [])
        setViewElements(newMap)
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
      })
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
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/${table}`, requestOptions)
            .catch(error => {
              console.log("2",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.success) { //Update the data in view only if sending to database succeeded
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
    if (responseJSON.success) { //Update the data in view only if sending to database succeeded
      if ('id' in data) {
        deleteData(table, data.id)
      }
      updateData(table, responseJSON.id, {...data, id: responseJSON.id});
    }
  }

  const toggleEditable = () => {
    if (editable) { //Save current view state
      for (let item of viewElements.get(selectedView)) {
        const cur = item.ref.current();
        item.x = cur.x;
        item.y = cur.y;
        if (typeof cur.width === 'string') {
          cur.width = cur.width.slice(0,-2);
          cur.height = cur.height.slice(0,-2);
        }
        item.width = cur.width;
        item.height = cur.height;
        saveViewElement(item);
      }
    }
    setEditable(!editable);
  }
  if (redirect) {
    return <Navigate to={redirectLocation} />;
  }

  const updateSelectedView = (id) => {
    if (!viewElements.has(id)) {
      const cookies = new Cookies();
      fetchViewData(id, cookies.get('token')).then(result => {
        if (result.success) {
          for (let element of result.data) {
            const ref = createRef(); //Create a ref for each viewElement in current view
            element['ref'] = ref;
          }
          let newMap = new Map(viewElements);
          newMap.set(id, result.data)
          setViewElements(newMap)
        }
      })
    }
    setSelectedView(id);
  }

  const addDataToElement = (item) => {
    if (defaultViewSize(item.type, item.size) === undefined) {
      return
    }
    const [width, height] = defaultViewSize(item.type, item.size);
    item['hostid'] = selectedView;
    item['width'] = width;
    item['height'] = height;
    item['x'] = 250;
    item['y'] = 200;
    saveViewElement(item).then(result => {
      if (result.success) {
        let newMap = new Map(viewElements);
        let newData = viewElements.get(selectedView);
        item.hostid = selectedView;
        item.id = result.id;
        item.ref = createRef();
        newData.push(item);
        newMap.set(selectedView, newData);
        setViewElements(newMap);
      }
    });
  }

  const deleteComponent = (id) => {
    deleteViewElement(id).then(result => {
      if (result.success) {
        let newMap = new Map(viewElements);
        let newData = viewElements.get(selectedView);
        newData = newData.filter(e => e.id !== id);
        newMap.set(selectedView, newData);
        setViewElements(newMap)
      }
    })
  }

  return (
    <div className="App">
      <Banner />
      <Divider views={views} selectedView={selectedView} />
      <Navigation views={views} editable={editable} setSelectedView={updateSelectedView} addView={(title) => handleAdd("views", {title: title})} deleteView={(id) => handleDelete("views", id)}/>
      <CoursesView editable={editable} sx={{height: 400, width: 800, x: 250, y: 250}} />
      {(viewElements.get(selectedView) ?? []).map((e,i) => {
        return chooseComponent(e,i)
      })}
      {/*<DayCalendar weekday={"Monday"} userData={{courses: courses, assignments: assignments, events: events, exams: exams, projects: projects}} sx={{height: 200, width:100, x: 250, y: 200}} />*/}
      <AddComponents editable={editable} toggleEditable={toggleEditable} saveViewElement={addDataToElement} />
    </div>
  );
}

export default App;