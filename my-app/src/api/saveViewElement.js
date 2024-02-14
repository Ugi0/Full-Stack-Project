import myConfig from '../config.js';
import Cookies from 'universal-cookie';

export async function saveViewElement(item) {
    const cookies = new Cookies();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': cookies.get('token') },
      body: JSON.stringify({
        viewelement: item
      })
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/viewelements`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.success) {
        return responseJSON
      }
    }
    return {success: false}
}