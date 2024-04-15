import Cookies from 'universal-cookie';
import myConfig from '../config.js';
import toast from 'react-hot-toast';

export async function fetchData(table) {
  const cookies = new Cookies();
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
    };
    let response = await fetch(`${myConfig.http}://${myConfig.BackendLocation}:${myConfig.BackendPort}/${table}`, requestOptions)
        .catch(e => {
          toast.error(`There was an issue fetching your data.\nPlease try to refresh the page.`,
          {
            duration: 20000,
            id: 1
          }
        )
        })
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.data) {
        return responseJSON.data;
      }
    }
}