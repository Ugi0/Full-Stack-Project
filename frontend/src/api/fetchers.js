import Cookies from 'universal-cookie';
import myConfig from '../config.js';

export async function fetchData(table) {
  const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`${myConfig.http}://${myConfig.BackendLocation}:${myConfig.BackendPort}/${table}`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        return responseJSON.data;
      }
    }
}