module.exports.findIdByKey = (array, key, value) => {
  for (var i = 0; i < array.length; i++){
    if(key in array[i] && array[i][key] === value) {
      return '_id' in array[i] ? array[i]._id : array[i].uuid;
    }
  }
  return null;
}
