const config = require('./JP.config.json');

const express = require('express');
const app = express();
const Mustache = require('mustache');
const bodyParser = require('body-parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const { union } = require('lodash')

const watch = require('node-watch');

require.extensions['.php'] = compiler
require.extensions['.html'] = compiler
function compiler(module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const root = path.resolve(`public`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/page', (req, res) => {
    const { data, template, title, category, format = "html", password } = req.body;
    if(password == config.password){
        delete req.body.password

        const templateTxt = require(`./templates/${template}.${format}`);
        const output = Mustache.render(templateTxt, data);

        const cleanTitle = title.toLowerCase().replace(/ /g, '-');
        const directory = `${root}/${category}/${cleanTitle}`;

        const metaGlobal = require('./public/meta.json');
        const meta = JSON.stringify({ last_update: new Date(), ...req.body });
        
        mkdirp.sync(directory);
        metaGlobal[template] = union(metaGlobal[template], [`${category}/${cleanTitle}`]);
        fs.writeFileSync(`${root}/meta.json`, JSON.stringify(metaGlobal));
        
        fs.writeFileSync(`${directory}/index.${format}`, output);
        fs.writeFileSync(`${directory}/meta.json`, meta);
    
        res.json({
            success: true,
            url: `${config.url}/${category}/${cleanTitle}`
        })
    }else{
        res.status(401).json({
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
    alterPageByTemplate(template);
});

function alterPageByTemplate(template){
    const paths = require('./public/meta.json')[template];
    paths.forEach(path => {
        const meta = require(`./public/${path}/meta.json`);
        console.log(path)
        fs.writeFileSync(`${root}/${path}/index.html`, Mustache.render(require(`./templates/${template}.html`), meta.data));
    })
}

