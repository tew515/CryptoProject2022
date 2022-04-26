// function to search for string in array and return its index if found
const searchStringInArray = (str, strArray) => {
    for (var i=0; i<strArray.length; i++) {
        if (strArray[i].match(str)) return i;
    }
    return -1;
}

// function to convert [camelCase] strings to [Title Case]
const camelCaseToTitleCase = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

// function to convert column names based on array prop of datatable/index.js
const covertColumnNameText = (key, headingTextOverrideArray) => {
    let newColumnNameText = key;
    if (headingTextOverrideArray) {
    if (headingTextOverrideArray.length >=1) {
    headingTextOverrideArray.forEach((headingTextValues) => {
        if (key === headingTextValues.key) {
        newColumnNameText = headingTextValues.text;
        }
    })
    }
}

return camelCaseToTitleCase(newColumnNameText);
}

// function to convert column values based on function prop of datatable/index.js
const covertColumnValue = (key, keyValue, tableDataTextOverideFunction) => {
    let newColumnValueText = keyValue;
    if (tableDataTextOverideFunction) {
        if (tableDataTextOverideFunction.length >=1) {
            tableDataTextOverideFunction.forEach((headingTextValues) => {
            if (key === headingTextValues.key) {
            if (headingTextValues.function instanceof Function) {
                newColumnValueText = headingTextValues.function(keyValue);
            }
            }
        })
    }
}

return newColumnValueText;
}
  
// function to round decmimal values to 2 places
const roundTo2 = (value) => {
    if (Number(value)) {
        if (value !== Math.floor(value)) {
        return parseFloat(value).toFixed(2);
        }
    }

    return value;
}

// function to cut off a decimal value after 5 places
const numberSlice = (value) => {
  try {    
    if (!String(value)) {
      value = value.toString();
    }

    let decimalSplit = value.split('.');
    return decimalSplit[0] + '.' +  decimalSplit[1].slice(0, 5);
  }
  catch {
    return value;
  }
}

// function to convert [kebab-case] strings to [Title Case]
const kebabCaseToTitleCase = (text) => {
    return text.split('-').map(char => char[0].toUpperCase() + char.substring(1).toLowerCase()).join(' ');
}

module.exports = {
    searchStringInArray,
    camelCaseToTitleCase,
    covertColumnNameText,
    covertColumnValue,
    roundTo2,
    numberSlice,
    kebabCaseToTitleCase,
}