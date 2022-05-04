const {readFile, writeFile} = require('fs').promises;
const {resolve} = require('path');

const fileData = readFile('./csv/in/open_units.csv', 'utf8');
const fileDataHeaders = [
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
    'Units per 100ml \n',
];

const write = async (fileContent) => {
    try {
        const data = await fileContent;
        const fileContentWithHeaders = fileDataHeaders.concat(data.split(','));
        const dataString = fileContentWithHeaders.join(';');
        const hunFormatData = dataString.replace(/\./g, ',');
        const deleteFirstComma = hunFormatData.replace('\n;', '\n');
        await writeFile('./csv/out/open_units_hun.csv', deleteFirstComma, 'utf8');

    } catch (err) {
        console.log(err);
    }
}

const createNewFileByCategory = async () => {
    try {
        let data = await readFile('./csv/in/open_units.csv', 'utf8');
        const dataArray = data.split('\n');
        let dataRows = [];
        let dataObjectsArray = [];
        
        for(let i=1; i< dataArray.length -1; i++) {
            let dataRow = dataArray[i].split(',');
            dataRows.push(dataRow)
        }

        for(let i=0; i< dataRows.length; i++) {
            let dataObj = {};

            for(let j = 0; j < fileDataHeaders.length; j++) {
                dataObj[fileDataHeaders[j]] = dataRows[i][j];
            }
            dataObjectsArray.push(dataObj); 
        }
        return dataObjectsArray;
        
    } catch(error) {
        console.log(error);
    }
}

write(fileData);

const mainFnc = async () => {
    await write(fileData);
    createNewFileByCategory().then(data => {
        const filteredDataObject=  data.reduce( (acc, obj) => {
            let key = obj['Category']
            if (!acc[key]) {
              acc[key] = []
            }
            acc[key].push(obj)
            return acc
          }, {})
          const filteredDataObjectsArray = Object.entries(filteredDataObject);
        
          for(let value of filteredDataObjectsArray){
              
              const fileName = value[0];
              let fileContent = value[1];
              let rowObj = '';
              let headers =  fileDataHeaders.join(';');
            
              for(let value of Object.values(fileContent)){
                  rowObj += `${Object.values(value)} \n`.replace(/,/g,';').replace(/\./g,',');
              }
              headers += rowObj;
            writeFile(resolve(`./csv/out/${fileName}.csv`), headers, 'utf8');
            }
    
    });
    return true;
}
mainFnc();

