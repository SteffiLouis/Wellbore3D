
var express = require("express");
var app = express();
var path = require("path");
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/trajectory.html'));
});
app.use("/scripts", express.static('./scripts/'));
app.use("/img",express.static('./img'));
app.use("/styles", express.static('./styles/'));
app.listen(3000);
console.log(__dirname)
console.log("Server running at Port 3000");