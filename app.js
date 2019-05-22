const http = require('http'); //imports http module (library) as "http", which allows you to create an http server

const hostname = '127.0.0.1'; //IP Address at which the server is to be hosted (I think :) )
const port = 3000; //port on which application will be hosted

//This block creates the server. 
//req is the HTTP request. It is a special object type, http.ClientRequest (https://nodejs.org/api/http.html#http_class_http_clientrequest)
//res is the HTTP response. It is a special object type, http.ServerResponse (https://nodejs.org/api/http.html#http_class_http_serverresponse)
//The argument for createserver is a function (in this case unnamed) which executes every time the server receives a request. 
const server = http.createServer( //creates server - http.createServer is a function returning an object of type http.Server (https://nodejs.org/api/http.html#http_class_http_server)
    function (req, res) { //executed whenever the server receives a request. Parameters are the server request and the server response. 
        res.statusCode = 200; //indicates status code to be sent to the client. Status code 200 means "OK"
        res.setHeader('Content-Type', 'text/plain'); //Sets an HTTP Header with name "Content-Type" and value "text/plain". This tells the client that the content it is about to receive is encoded as plain text
        res.end('Hello World\n'); //Passes in the data 'HelloWorld\n' as the body of the response, then signals that the response is ready to send ('end of adding to body'), so the body is sent
    }
);

server.listen(port, hostname, () => { //this tells the server to start listening for requests. The first parameter is the port number. The second parameter is the host name. The third parameter is a function, defined inline, using the ES6 Arrow Function Expression (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  console.log(`Server running at http://${hostname}:${port}/`); //this logs to console. ${varName} represents the value of varName, stringified. 
});