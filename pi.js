var fs = require("fs");
var express = require("express");
var argv = require("optimist").argv;
var spawn = require("child_process").spawn;
var concat = require("concat-stream");

var app = express();

/*
-- HTTP API --
GET /pi

query options:
live - compute Pi in realtime
size - Number of characters to return
start - slice string from x
end - slice string to x

*/

app.get("/pi", function(req, res) {
  res.setHeader("Content-Type", "text/pi");
  res.setHeader("Access-Control-Allow-Origin", "*");
  var options = [];

  var digits = req.query.digits;
  
  
  // Security
  if (digits && /\d+/.test(digits)) {
    options.push("-d=" + parseInt(digits));
  }
  
  if (req.query.live) {
    if (digits > 10000)
      digits = 512;
    
    var piProc = spawn("./pi", options);

    piProc.stdout.pipe(concat(function(data) {
      res.write("3." + data.toString().replace(/^3/, ""));
    }));

    piProc.stdout.on("end", function() {
      res.end();
    });
  }
  else {
    fs.readFile("./pi-1M.txt", function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        var pi = data.toString();
        
        var start = req.query.start;
        var end = req.query.end;
        
        if (start && end) {
          res.send(pi.slice(parseInt(start), parseInt(end)));
        }
        else if (req.query.size && /\d+/.test(req.query.size)) {
          res.send(pi.slice(0, parseInt(req.query.size)));
        }
        else {
          res.send(pi.slice(0, 2048));
        }
      }
    });
  }
});

var port = argv.p || argv.port || 8999;

if (argv.generate) {
  var piSize = argv.size || (function() { console.error("Use --size"); process.exit(); })();
  var piFile = argv.file || (function() { console.error("Use --file"); process.exit(); })();

  var piProc = spawn("./pi", ["-d=" + piSize])
  
  piProc.stdout.on("end", function() {
    console.log("done");
  });
  
  piProc.stdout.pipe(concat(function(data) {
    var output = "3." + data.toString().replace(/^3/, "");

    fs.writeFile("./" + piFile, output, function(err) {
      if (err) throw err;
      console.log("saved", piFile);
    });
  }))
}
else {
  app.listen(parseInt(port));
  console.log("Listening on port", port);
}
