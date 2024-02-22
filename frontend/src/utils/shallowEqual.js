export default function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    for (let key of ['width', 'height', 'x', 'y']) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
  }