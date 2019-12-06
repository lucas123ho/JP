# JSON Page
Make pages with a template and a JSON

## How to install
1. Clone this repository
```console
    git clone https://github.com/lucas123ho/JP.git
```
2. Inside the repository, install all dependencies
```console
    yarn
    // or
    npm install
```
3. Start the server
```console
    yarn start
    // or
    npm start
```

## Usage
JSON Page works through a Rest API allocated on localhost on port 3000
### Create page
1. To create a new page you will need an HTML template, which should be in the templates folder. *(./templates/{{YOUR_TEMPLATE_NAME}}.html)*

**Template example**
```html
<!-- ./templates/blog.html -->
    <h1>{{ title }}</h1>
    <img src="{{ image }}" /> 
```
2. Send POST request with JSON in body to Rest API on **http://localhost:3000** or your host in route */page*.
```JSON
    {
        "template": "blog", // ./template/blog.html
        "category": "blog/animals", // final path /blog/animals/{{TITLE}}
        "title": "Fly Monkey", // final path /blog/animals/fly-monkey
        "data": {
            "title": "Fly Monkey",
            "image": "https://3.bp.blogspot.com/-PM-YEB-tOv0/WL01xVSS4qI/AAAAAAAACFA/r2OesvlcjF436wT-xNI9vgW5mUYAH5gvACLcB/s1600/flying%2Bmonkey.jpg"
        },
        "password": "123456" // This password should changed in JP.config.json
    }
```
*Response*
```JSON
    {
        "success": true,
        "url": "http://localhost:3000/blog/animals/fly-monkey
    }
```
*Output Static page*
```HTML
    <!-- ./public/blog/animals/fly-monkey/index.html -->
    <h1>Fly Monkey</h1>
    <img src="https://3.bp.blogspot.com/-PM-YEB-tOv0/WL01xVSS4qI/AAAAAAAACFA/r2OesvlcjF436wT-xNI9vgW5mUYAH5gvACLcB/s1600/flying%2Bmonkey.jpg" /> 
```


