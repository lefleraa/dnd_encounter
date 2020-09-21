function compactObject(object, full) {
  let obj = { ...object };
  let propNames = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < propNames.length; i++) {
    let propName = propNames[i];
    if (full) {
      if (!obj[propName]) {
        delete obj[propName];
      }
    } else {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }
  return obj;
}

export default compactObject;
