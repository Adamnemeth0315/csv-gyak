const {readFile, writeFile} = require('fs').promises;
const {resolve} = require('path');

const fileData = readFile('./files/in/en.txt', 'utf8');

const write = async (path, fileContent) => {
    try {
        let data = await fileContent;
        data += 'Valami plusz szöveg.';
        await writeFile(path, data);
        return true;
    } catch(err) {
        console.error(err);
    }
}

const modifyFileData = async () => {
    try {
        let data = await readFile('./files/out/enp.txt');
        data += 'Még valami szöveg !!';
        await write(resolve('./files/out/enp_modify.txt'), data, 'utf8');
        return true;
    } catch(error) {
        console.log(error);
    }
}

const mainFnc = async () => {
    await write(resolve(`./files/out/enp.txt`), fileData);
    await modifyFileData();
    return true;
}
mainFnc();

