## Serverless Framework example of PHP based service

This is an example of using the [Serverless Framework](http://serverless.com) to deploy an AWS lambda which runs a PHP function for converting chess games from [lichess](http://lichess.org) into a pretty-printed PDF. 

See my blog post [here](http://blog.zerosharp.com/a-concrete-php-serverless-example/).

### Prerequisites
- [serverless](https://serverless.com/)
- [node](https://nodejs.org)

###

Install this serverless project. It will create a new serverless-php folder.
```shell
serverless install --url https://github.com/ZeroSharp/serverless-lichess-pdf-exporter
```

### Deploying the sample function to AWS

Check the `serverless.yml` file and modify region and stage if necessary.
```shell
sls deploy
```

### Running the function locally

```shell
sls invoke local --function Xp9MOs3d > Xp9MOs3d.pdf
```

### Running the function on AWS

```shell
sls invoke --function Xp9MOs3d > Xp9MOs3d.pdf
```

## Thanks ##

Thanks to [James Clarke](https://github.com/clarkerubber/lichessPDFExporter) who wrote the PHP exporter.

