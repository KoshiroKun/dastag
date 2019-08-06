const fs = require('fs');
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const projectData = JSON.parse(json);

const server = http.createServer((request, response) => {
    const pathName = url.parse(request.url, true).pathname;
    const id = url.parse(request.url, true).query.id;
    //console.log(url.parse(request.url, true));
    //console.log(pathName);

    // PROJECT OVERVIEW
    if (pathName === '/projects' || pathName === '/') {
        response.writeHead(200, { 'Content-type': 'text/html' });
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (error, data) => {
            let output = data;
            fs.readFile(`${__dirname}/templates/template-cards.html`, 'utf-8', (error, data) => {
                let cardsOutput = projectData.map(element => replaceTemplate(data, element));
                cardsOutput = shuffleArray(cardsOutput).join('');
                output = output.replace(/{%CARDS%}/g, cardsOutput);
                response.end(output);
            });
        });

    // project DETAIL
    } else if (pathName === '/project' && id < projectData.length) {
        response.writeHead(200, { 'Content-type': 'text/html' });
        
        fs.readFile(`${__dirname}/templates/template-project.html`, 'utf-8', (error, data) => {
            const project = projectData[id];
            const output = replaceTemplate(data, project);
            response.end(output);
        });

    // IMAGES
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (error, data) => {
            response.writeHead(200, { 'Content-type': 'image/jpg' });
            response.end(data);
        });     

    // CSS
    } else if ((/\.(css)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/css${pathName}`, (error, data) => {
            response.writeHead(200, { 'Content-type': 'text/css' });
            response.end(data);
        });  

    // URL NOT FOUND
    } else {
        response.writeHead(404, { 'Content-type': 'text/html' });
        response.end('URL not found on the server');
    }
});

server.listen(PORT, () => {
    console.log('Server at service');
});

function replaceTemplate(originalHtml, project) {
    let output = originalHtml.replace(/{%ID%}/g, project.id);
    output = output.replace(/{%PROJECTNAME%}/g, project.projectName);
    output = output.replace(/{%IMAGE%}/g, project.image);
    output = output.replace(/{%SHORTDESCRIPTION%}/g, project.shortDescription);
    output = output.replace(/{%DESCRIPTION%}/g, project.description);
    output = output.replace(/{%TECH%}/g, project.tech);
    output = output.replace(/{%GITHUB%}/g, project.github);
    output = output.replace(/{%URL%}/g, project.url);
    return output;
}

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }