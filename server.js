var express = require('express');

var Storage = {
    add: function(name) {
        var item = {
            name: name,
            id: this.setId
        };
        this.items.push(item);
        this.setId += 1;
        return item;
    },
    remove: function(id) {
        var index;
        for(var i = this.items.length - 1 ; i >= 0; i--) { //last index is length - 1 to avoid array access exception
          if (this.items[i].id == id) { // comparing IDs is better than comparing full objects
            index = i;
            break;
          }
        }
        this.items.splice(index, 1);
        return id;
    },
    edit: function(id, item) {
        var item = {
            name: item,
            id:id
        };
        var index;
        for(var i = this.items.length - 1 ; i >= 0; i--) {
          if (this.items[i].id == id) { // use of the === operator is dangerous here,
            // the id passed in coming from request.params is a string and is compared to an
            // integer inside the this.items array which returns false even if they are the
            // same IDs. This messed things up. Same applied to the remove function.
            index = i;
            break;
          }
        }
        this.items.splice(index, 1, item);
    }
};
var createStorage = function() {
    var storage = Object.create(Storage);
    storage.items = [];
    storage.setId = 1;
    return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.listen(process.env.PORT ||3000, process.env.IP);

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});


app.delete('/items/:id', jsonParser, function(request, response) {
  var id = request.params.id;
  // id here is a string, which when passed in to the remove function is compared to an
  // integer stored inside the items list. Using the === operator is dangerous
  // as it always returns false due to the difference in data types even if IDs do match.
  // I changed this to use == instead.
  var deleted = storage.remove(id) //pass the id for comparison
  return response.status(200).json(deleted);
});

app.put('/items/:id', jsonParser, function(request, response) {
  var id = request.params.id
  // Same applies as above.
  var newItem = request.body.name;
  storage.edit(id, newItem);
  return response.status(200).json(newItem);
});

exports.app = app;
exports.storage = storage;
