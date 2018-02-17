var request = require('request');

module.exports = function (context, cb) {

    console.log("This is a slack request - YouTube");

    // in the search url, spaces in keywords are replaced with '+' sign
    var search = context.body.text.replace(context.secrets.TRIGGER_WORD, '').trim().replace(/\s/g, '+');
    console.log('Keyword= ' + search)

    const request_url = 'https://www.googleapis.com/youtube/v3/';

    var url = request_url + 'search?' +
        'part=snippet' +
        '&maxResults=5' +
        '&q=' + search +
        '&type=video' +
        '&videoCaption=closedCaption' +
        '&key=' + context.secrets.YOUTUBE_APP_KEY;

    console.log('url= ' + url);

    request.get(url, function(error, res, body) {

        if (error) {
            console.log(error);
            cb(null, error);
        } else {

            // build url: https://www.youtube.com/watch?v=videoId
            var res = JSON.parse(body);
            var items = res.items;

            if (items.length === 0) {

                cb(null, { text : 'No videos found:(' });
            }

            var random = Math.floor(Math.random() * 5); // returns a number between 0 and 29
            var vidId = items[random].id.videoId;
            console.log('Video Id= ' +vidId)

            var vidUrl = 'https://www.youtube.com/watch?v=' + vidId;

            cb(null, { text : vidUrl });
        }
    })
}
