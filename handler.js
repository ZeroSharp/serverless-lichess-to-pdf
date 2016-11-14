'use strict';

var child_process = require('child_process');

module.exports.exportToPdf = (event, context) => {
  if (!event.gameid)
  {
    event.gameid = "Xp9MOs3d";
    //return context.fail("Please include the gameid.");
  }    
 
  var strToReturn = '';
  //console.log("xxx child_process.spawn()");
  var proc = child_process.spawn('./php', [ "main.php", event.gameid, { stdio: 'inherit' } ]);
  //console.log("xxx proc.stdout.on(data)");
  proc.stdout.on('data', function (data) {
    //console.log("xxx --> proc.stdout.on");
  	var dataStr = data.toString()
    //console.log('stdout: ' + dataStr);
    strToReturn += dataStr
  });

  //console.log("xxx proc.stderr.on(data)");
  proc.stderr.on('data', function (data) {
    //console.log("xxx --> proc.stderr.on");
    console.log(`stderr: ${data}`);
    //context.fail(data)
  });

  console.log("xxx proc.on('close')");
  proc.on('close', function(code) {
    //console.log("xxx --> proc.on");
    if(code !== 0) {
      return context.done(new Error("Process exited with non-zero status code"));
    }
   
   context.succeed(strToReturn);
  });
};