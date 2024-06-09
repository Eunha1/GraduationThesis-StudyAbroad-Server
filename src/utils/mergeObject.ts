export const mergeObject = (firstObj : Object, secondObj: Object)=>{
  let mergedObj = {
    ...firstObj
  };
  for (const key in secondObj) {
    if (mergedObj.hasOwnProperty(key) ) {
      if(secondObj[key] !== undefined && Array.isArray(mergedObj[key])){
        mergedObj[key] = mergedObj[key].concat(secondObj[key])
      }
      if(!Array.isArray(mergedObj[key])){
        mergedObj[key] = new Array(mergedObj[key])
        mergedObj[key] = mergedObj[key].concat(secondObj[key])
      }
    }else {
      mergedObj[key] = secondObj[key]
    }
  }
  return mergedObj;
}