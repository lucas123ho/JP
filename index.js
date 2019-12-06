const config = require('./JP.config.json');

const express = require('express');
const app = express();
const Mustache = require('mustache');
const bodyParser = require('body-parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const watch = require('node-watch');

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
        delete req.body.password

        const templateTxt = require(`./templates/${template}.${format}`);
        const output = Mustache.render(templateTxt, data);
        
        const root = path.resolve(`public`);

        const cleanTitle = title.toLowerCase().replace(/ /g, '-');
        const directory = `${root}/${category}/${cleanTitle}`;

        const metaGlobal = require('./public/meta.json');
        const meta = JSON.stringify({ last_update: new Date(), ...req.body });
        
        mkdirp.sync(directory);
        fs.writeFileSync(`${root}/meta.json`, JSON.stringify([ ...metaGlobal, { title: cleanTitle, template } ]));
        fs.writeFileSync(`${directory}/index.${format}`, output);
        fs.writeFileSync(`${directory}/meta.json`, meta);
    
        res.json({
            success: true,
            url: `${config.url}/${category}/${cleanTitle}`
        })
    }else{
        res.json({
            success: false,
            message: "Ivalid password"
        });
    }
})

app.listen(config.port, () => {
    console.log('http://localhost:3000')
});

watch('templates', { recursive: true }, function(evt, name) {
    const arrayName = name.split('\\');
    const template = arrayName[arrayName.length-1].split('.')[0];
    console.log(template);
});

function alterTemplate(template){
    
}

