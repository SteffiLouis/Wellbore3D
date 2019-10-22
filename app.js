// var http = require('http');
// var fs = require("fs");
 
// http.createServer(function(request, response) {
//     fs.readFile("index.html", function(err, data){
//         response.writeHead(200, {'Content-Type': 'text/html'});
//         response.write(data);
//         response.end();
//       });
// }).listen(3000);

// const http = require('http');
// const fs = require("fs");
// const hostname = 'localhost';
// const port = 3000;

// const server = http.createServer((req, res) => {
//     fs.readFile("views/trajectory.html", function(err, data){
//        // res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write(data);
//         res.end();
//     });
// //   res.statusCode = 200;
// //   res.setHeader('Content-Type', 'text/plain');
// //   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
var express = require("express");
var app = express();
var path = require("path");
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/trajectory.html'));
  //__dirname : It will resolve to your project folder.
});
app.use("/scripts", express.static('./scripts/'));
app.use("/Images",express.static('./Images'));
app.use("/styles", express.static('./styles/'));
app.listen(3000);
console.log(__dirname)
console.log("Server running at Port 3000");