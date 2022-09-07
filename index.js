const {readFile, writeFile} = require('fs').promises;
const {resolve} = require('path');

const fileData = readFile('./csv/in/open_units.csv', 'utf8');
const csvHeaders = [
    'Product',
    'Brand',
    'Category',
    'Style',
    'Quantity',
    'Quantity Units',
    'Volume',
    'Package',
    'ABV',
    'Units of Alcohol',
    'Units (4 Decimal Places)',
    'Units per 100ml',
];

const writeHunCSV = async (data) => {
    try {
        const headerString = csvHeaders.join(';');
        const contentString = data.split(',').join(';').replace(/\./g, ',');
        const hunFormatData = `${headerString}\n${contentString}`;

        await writeFile('./csv/out/open_units_hun.csv', hunFormatData, 'utf8');

        return true;
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Creates array of objects from csv & header data.
 * @param {string} rawStringData - Raw csv file read as string.
 * @param {string[]} headers - Array of headers for the csv data.
 * @return {Array<{}>} The array of objects.
*/
const createObjectArray = (rawStringData, headers) => {
    try {
        const rowArray = rawStringData.split('\n');
        rowArray.pop();

        const rowObjectData = [];

        for(let row of rowArray) {
            const cellArray = row.split(',');
            if (cellArray.length !== headers.length) throw new Error(`Row and header length mismatch! Row: ${cellArray.length}, Row: ${headers.length}`);
            let dataObj = {};

            for(let i in headers) {
              dataObj[headers[i]] = cellArray[i];
            }

            rowObjectData.push(dataObj);
        }

        return rowObjectData;
    } catch(error) {
        throw new Error(err);
    }
}

/**
 * Creates filtered file from rowObjectData & header data.
 * @param {Array<{}>} rowData - Array of objects.
 * @return {Boolean} Return true if file is done.
*/

const writeHunCSVByCategory = (rowData) => {
  const dataByCategory =  rowData.reduce( (acc, obj) => {
    let key = obj['Category'];

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(obj);

    return acc
  }, {});

  const categoryEntries = Object.entries(dataByCategory);

  for(let [category, data] of categoryEntries){
      const fileName = category.toLocaleLowerCase();
      let contentStringAcc = '';
      let headers =  csvHeaders.join(';');
    
      for(let value of Object.values(data)) {
          contentStringAcc += `${Object.values(value).join(';')} \n`.replace(/\./g,',');
      }

      const dataToWrite = `${headers}\n${contentStringAcc}`;

      writeFile(resolve(`./csv/out/${fileName}.csv`), dataToWrite, 'utf8');
    }
    return true;
}

const mainFnc = async () => {
  const dataObjectsArray = createObjectArray(await fileData, csvHeaders);

  writeHunCSVByCategory(dataObjectsArray);

  writeHunCSV(await fileData);

}

mainFnc();