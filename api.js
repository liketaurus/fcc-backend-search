module.exports = function(app, db) {
    app.route('/:query').get(newQuery);
    app.route('/latest').get(getlatest);


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
            save(queryDocument, db);
        var najax = require('najax')
        najax.get('http://api.ababeen.com/api/images.php?q='+query+'&count='+size, function(data){
            data=JSON.parse(data);
            res.send(data.map(function(img){
                return {
                    "url": img.url,
                    "snippet": img.title,
                    "thumbnail": img.tbUrl,
                    "context": img.originalContextUrl
                }; 
            }));
        });
            
    }

    function getlatest(req, res)
    {
        console.log('Not implemented yet');
    }

    

}