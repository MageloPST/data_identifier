const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "<CONNECTION_STRING>";
const DATABASE_NAME = "data_identifier";
const Utils = require('./utils');


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("patterns");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/check-pattern", (request, response) => {
    var _body = request.body;
    if (Array.isArray(_body)) {
        return response.send('Split that fucking json file');
    } else {
        var values = Utils.parse_json(_body);

        collection.find({}).toArray((error, regex_object) => {
            if (error) {
                return response.status(500).send(error);
            }
            var _matched_data = [];
            values.forEach(function (item, index) {
                regex_loop: for (let i=0; i<regex_object.length; i++) {
                    var _regex = regex_object[i]['regular_expression'];
                    for (let j=0; j<_regex.length; j++) {
                        var match = Utils.check_data(item, _regex[j]);
                        if (match) {
                            var _aux = {};
                            _aux['data'] = item;
                            _aux['type'] = regex_object[i]['type'];
                            _aux['index_regex'] = j;
                            _matched_data.push(_aux);
                            //break regex_loop;
                        }
                    }
                }
            });
            response.send(_matched_data);
        });
    }
});

app.post("/say-hi", (request, response) => {
    response.send('hi');
});