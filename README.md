# Data Layout

```json
{
    "uuid": {
        "uuid": "uuid",
        "title": "string",
        "entryDate": 12345,
        "modifiedDate": 12345,
        "doneDate": 12345,
        "dueDate": 12345,
        "times": [12345, 12355],
        "hidden": false,
        "open": true,
        "parents": ["uuid", "uuid"],
        "children": ["uuid", "uuid"],
        "tags": ["string", "string"],
        "priority": 5,
        "users": ["uuid", "uuid"],
        "syncTime": 12345
    }
}
```

# Actions

* create
* modify
* start
* stop
* open
* close
* user
  * signin
  * signout
  * create
  * delete
* config
* report
  * autolist
  * detail
  * list

# Option 1

Server only
* All the date is stored only on the server
* Every call just retrieves data from the server
* Only updates data on the server

## Pros
* Everything is always syncronized
* Will work everywhere


## Cons
* Cannot work offline
* Requires constant calls to server
* Can be slow?

# Option 2

Store latest on server
* Store one instance of all data on the server
* Store instance of all data on the client
* Update each with every call

## Pros
* Stores minimal data on server
* Can work offline
* Can easily copy total data back to user
* Most of processing happens on the user end

## Cons
* Storing duplicates of data on server and client

# Option 3

Store list of commands for each task on the server, then the database locally for the client
* Store one instance of the data on the client
* Store the action logs of the data on the server
* Store recent action logs of the data on the client
* Simply add and retrieve actions with every call
* Update data on the client
  
## Pros
* Can run offline
* Very easy server code
* Fast server response
* All of the processing happens on the user end

## Cons
* Stores lots of data on the server?
* Makes it difficult for a webinterface, or any interface that does not have stored data.
