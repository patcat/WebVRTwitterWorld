var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    port = process.env.PORT || 8080,
    io = require('socket.io')(server),
    config = require('./config.json'),
    Twitter = require('node-tweet-stream'),
    t = new Twitter(config);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get(/^(.+)$/, function(req, res) {
  res.sendFile(__dirname + '/public/' + req.params[0]);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
 
server.listen(port, function() {
  console.log('Listening on ' + port);
});

t.track('pizza');
t.on('tweet', function(tweet){
  console.log('Roger that. Tweets incoming!');
  console.log(tweet);

  io.emit('tweet', tweet);
});

t.on('error', function (err) {
  console.log('Brace yourself! We are goin doooowwwwwwnnnnnnnn! ', err);
});