import Cookies from 'universal-cookie';
import myConfig from '../config.js';

export async function fetchCourses(setCourses) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/courses`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        setCourses(responseJSON.data);
      }
    }
}

export async function fetchAssignments(setAssignments) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/assignments`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        setAssignments(responseJSON.data);
      }
    }
}

export async function fetchEvents(setEvents) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/events`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        setEvents(responseJSON.data);
      }
    }
}

export async function fetchViews(setViews) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/views`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        setViews(responseJSON.data);
      }
    }
}

export async function fetchViewElements(setViewElements) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/viewelements`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        setViewElements(responseJSON.data);
      }
    }
}

export async function fetchExams(setExams) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/exams`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        setExams(responseJSON.data);
      }
    }
}