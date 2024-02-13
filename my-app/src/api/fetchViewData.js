import myConfig from '../config.js';

export async function fetchViewData(id, token) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': token }
    };
    let response = await fetch(`http://${myConfig.BackendLocation}:${myConfig.BackendPort}/viewelements/${id}`, requestOptions)
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