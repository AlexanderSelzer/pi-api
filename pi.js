var express = require("express");
var spawn = require("child_process").spawn;
var concat = require("concat-stream");

var app = express();

app.get("/pi", function(req, res) {
  res.setHeader("Content-Type", "text/pi");

  var digits = req.query.digits;
  var options = [];
  if (digits) {
    options.push("-d=" + digits);
  }
  var piProc = spawn("./pi", options);

  piProc.stdout.pipe(concat(function(data) {
    res.write("3." + data.toString().replace(/^3/, ""));
  }));

  piProc.stdout.on("end", function() {
    res.end();
  });
});

app.listen(8999);
