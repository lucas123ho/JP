const config = require('./JP.config.json');

const express = require('express');
const app = express();
const Mustache = require('mustache');
const bodyParser = require('body-parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

require.extensions['.php'] = compiler
require.extensions['.html'] = compiler

function compiler(module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/page', (req, res) => {
    const { data, template, title, category, format = "html", password } = req.body;
    if(password == config.password){
        const templateTxt = require(`./templates/${template}.${format}`);
        const output = Mustache.render(templateTxt, data);
    
        const cleanTitle = title.toLowerCase().replace(/ /g, '-');
        const directory = path.resolve(`public/${category}/${cleanTitle}`);
    
        mkdirp.sync(directory);
        fs.writeFileSync(`${directory}/index.${format}`, output);
    
        res.send(`${config.url}/${category}/${cleanTitle}`)
    }else{
        res.send('Ivalid password');
    }
})


app.listen(config.port, () => {
    console.log('http://localhost:3000')
});
