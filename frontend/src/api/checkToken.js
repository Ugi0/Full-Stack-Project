export async function checkToken(token) {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'token': token },
    };
    let response = await fetch(`${process.env.REACT_APP_BACKENDLOCATION}/verifyToken`, requestOptions)
            .catch(error => {
                console.log("1",error)
            });
    if (response) {
      let responseJSON = await response.json()
      if (responseJSON.success === false) {
        return false;
      } else if (responseJSON.success) {
        return true;
      }
    }
}