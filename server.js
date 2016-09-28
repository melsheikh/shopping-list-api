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
        for (var i = 0 ; i < this.items.length ; i++) {
          if (this.items[i].id === id) {
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
            id: id
        };
        var index;
        for (var i = 0 ; i < this.items.length ; i++) {
          if (this.items[i].id === id) {
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

app.listen(process.env.PORT || 3000, process.env.IP);

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
  var deleted = storage.remove(storage.items[id - 1])
  return response.status(200).json(deleted);
});

app.put('/items/:id', jsonParser, function(request, response) {
  var id = request.params.id
  console.log(request.body.name);
  var newItem = request.body.name;
  storage.edit(id, newItem);
  return response.status(200).json(request.body.name);
});


