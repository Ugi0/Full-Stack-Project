export default function shallowEqual(object1, object2) {
    console.log(object1, object2)
  
    for (let key of ['width', 'height', 'x', 'y']) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
  }