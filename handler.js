'use strict';

const AWS = require('aws-sdk');
const child_process = require('child_process');
const stream = require('stream');

const s3 = new AWS.S3();

module.exports.exportToPdf = (event, context, callback) => {

  var gameid = event.pathParameters.gameid; 
  
  if (!gameid)
  {
      return callback(new Error(`Please include the game id in the request.`));
  }    

  const key = gameid + ".pdf";
  const bucket = 'serverless-lichess-to-pdf.dev';

  var php = './php';
  
  // workaround to get 'sls invoke local' to work
  if (typeof process.env.PWD !== "undefined") {
    php = 'php';
  }

  var proc = child_process.spawn(php, [ "main.php", gameid, { stdio: 'inherit' } ]);

  var phpResult = new stream.Readable();
  phpResult._read = function noop() {};

  proc.stdout.on('data', function (data) {
    var dataStr = data.toString('utf8');
    phpResult.push(data);
  });

  proc.stderr.on('data', function (data) {
    console.log(`stderr: ${data}`);
  });

  proc.on('close', function(code) {
    if(code !== 0) {
      return callback(new Error(`Process exited with non-zero status code ${code}`));
    }
    else
    {
      // close the stream
      phpResult.push(null);

      var body = phpResult.read();

      const params = {
        Bucket: bucket,
        Key: key,
        ACL: 'public-read-write',
        Body: body,
        ContentType: 'application/pdf'
      };

      s3.putObject(params, function(err, data) {
        if (err)
        {
          return callback(new Error(`Failed to put s3 object: ${err}`));
        }

        const response = {
          statusCode: 302,
          headers: {
              location : `https://s3-eu-west-1.amazonaws.com/${bucket}/${key}`
          }
        };

        return callback(null, response);
      });
    }
  });
};