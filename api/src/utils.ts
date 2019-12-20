export const checkData = (data: any, pattern: any) => {
  const regex = new RegExp(pattern)
  return regex.test(data)
}

export const parseJson = (jsonData: any) => {
  const allAttributes = new Array()
  // tslint:disable-next-line: forin
  for (const attribute in jsonData) {
    allAttributes.push(jsonData[attribute])
  }
  return allAttributes
}

export const executePreviousFilters = (data: any, constants: any) => {
  // Previous filters
  // var _aux = false;
  let _aux: any = {}
  if (!isNaN(data)) {
    _aux['data'] = data
    if (data > 0 && data < 100) {
      _aux['type'] = 'age'
    } else {
      _aux['type'] = 'number'
    }
    _aux['counts'] = 1
    return _aux
  } else {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < constants.length; i++) {
      const values = constants[i]['value']
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < values.length; j++) {
        if (data.toLowerCase() == values[j].toLowerCase()) {
          _aux = {}
          _aux['data'] = data
          _aux['type'] = constants[i]['type']
          // _aux['counts'] = 1;
          // console.log(_aux);
          return _aux
        }
      }
    }
  }
  return false
}
