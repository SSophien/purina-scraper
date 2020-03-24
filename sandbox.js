/* eslint-disable no-console, no-process-exit */
const purina = require('./purina')
var fs = require('fs')

const links = [];

const baseUrl = "https://www.purina.com"

async function writeJsonFile(links){
	for (let i = 0; i < links.length; i++) {
    const cat = await purina.scrapeCatsInfo(links[i]);
		let file_path = './cats/' + cat.name.toLowerCase().replace(/ /g, '_') + '.json'
    fs.writeFileSync(file_path, JSON.stringify(cat, null, 4), (err) =>{
			if(err) {console.log(err); return;}
			console.log("File has been created")
		})
  }
}

async function sandbox() {
  let i = 0;
  while (true) {
    try {
      var url = baseUrl + "/cats/cat-breeds?page=" + i;
      console.log(`Browsing ${url} source`);

      const _links = await purina.scrapeLinks(url);
      let len = _links.length
      if (len == 0) {
        break;
      }
      for (let j = 0; j < len; j++) {
        links.push(_links.pop());
      }
      i++;
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
	await writeJsonFile(links)
  process.exit(0);
}



const [, , link] = process.argv;

sandbox();
