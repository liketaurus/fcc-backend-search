//ababeen's best free google  image search  APIs1.0 used
//see more: http://api.ababeen.com/
module.exports = function(app, db) {

    app.route('/latest').get(getlatest);
    app.get('/:query', newQuery);


    app.route('/')
        .get(function(req, res) {
            var firstDate;
            var queries = db.collection('queries');
            queries.find({}).toArray(function(err, result) {
                firstDate=result[0].when;
            });
            queries.find({}).count(function(err,rescount){
                res.render(process.cwd() + '/ui/index.html', {
                num: rescount,
                since: firstDate.split(',')[0]
            });
            });
        });

    function save(obj, db) {
        var queries = db.collection('queries');
        queries.save(obj, function(err, result) {
            if (err) throw err;
            console.log('Saved ' + result);
        });
    }

    function newQuery(req, res) {

        var query = req.params.query;
        var size = req.query.offset || 10;

        var queryDocument = {};
        queryDocument = {
            "term": query,
            "when": new Date().toLocaleString()
        };
        if (query !== 'favicon.ico') {
            save(queryDocument, db);
        }

        var najax = require('najax')
        najax.get('http://api.ababeen.com/api/images.php?q=' + query + '&count=' + size, function(data) {
            data = JSON.parse(data);
            res.send(data.map(function(img) {
                return {
                    "url": img.url,
                    "snippet": img.title,
                    "thumbnail": img.tbUrl,
                    "context": img.originalContextUrl
                };
            }));
        });

    }

    function getlatest(req, res) {
        var queries = db.collection('queries');
        queries.find({}).toArray(function(err, result) {
            res.send(result.sort(function(a, b) {
                    return new Date(b.when).getTime() - new Date(a.when).getTime()
                })
                .filter(function(fav) {
                    return fav.term !== 'favicon.ico';
                })
                .map(function(query) {
                    return {
                        term: query.term,
                        when: query.when
                    };
                }));
        });
    }



}