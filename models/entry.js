var mongoose = require('mongoose');
var Fuse = require('fuse.js');
var uuid3 = require('uuid/v3');

function fmtDate(timestamp) {
  var date = new Date(timestamp);
  return date.getYear().toString() + date.getMonth().toString() +
    date.getDay().toString() + date.getHours().toString() +
    date.getMinutes().toString() + date.getSeconds().toString();
}

var entrySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  projects: [String],
  tags: [String],
  priority: Number,
  entryDate: Number,
  dueDate: Number,
  doneDate: Number,
  modifiedDate: Number,
  status: String,
  times: String,
  uuid: String,
});

var Entry = module.exports = mongoose.model('Entry', entrySchema);

module.exports.createEntry = (entry, callback) => {
  entry['status'] = 'PENDING';
  entry['entryDate'] = Math.floor(Date.now() / 1000);
  entry['modifiedDate'] = Math.floor(Date.now() / 1000);
  entry['times'] = "[]".toString();
  entry['uuid'] = uuid3(entry['title'] + fmtDate(entry['entryDate']),
    uuid3.URL);
  var newEntry = new Entry(entry);
  newEntry.save();
  callback(null, newEntry);
}

module.exports.syncEntry = (ent_uuid, entry, callback) => {
  Entry.findOne({
    uuid: ent_uuid
  }, (err, db_entry) => {
    if (err) callback(err, null);
    else if (db_entry == null) {
      var newEntry = new Entry(entry);
      newEntry.save();
      callback(null, newEntry);
    } else if (db_entry.modifiedDate < entry.modifiedDate || entry.modifiedDate === undefined) {
      entry.modifiedDate = Math.floor(Date.now() / 1000);
      Entry.findOneAndUpdate({
        uuid: ent_uuid
      }, entry, (err, db_entry) => {
        if (err) callback(err, null);
        else callback(null, db_entry);
      })
    } else {
      callback(null, db_entry);
    }
  });
}

module.exports.syncEntries = (entries, callback) => {
  var entry = entries[0];
  entry.times = JSON.stringify(entry.times);
  Entry.findOne({
    uuid: entry.uuid
  }, (err, db_entry) => {
    console.log("SYNCING ENTRY")
    console.log(db_entry, entry);
    if (err) callback(err);
    else if (db_entry.modifiedDate <= entry.modifiedDate || entry.modifiedDate === undefined) {
      Entry.findOneAndUpdate({
        uuid: db_entry.uuid
      }, entry, (err, db_entry) => {
        if (err) callback(err);
        console.log(db_entry);
        if (entries.length > 1) {
          console.log("NEXT");
          entries.shift();
          module.exports.syncEntries(entries, callback);
        } else {
          console.log("DONE");
          callback(null);
        }
      });
    } else {
      if (entries.length > 1) {
        entries.shift();
        module.exports.syncEntries(entries, callback);
      } else {
        callback(null);
      }
    }
  });
};

module.exports.deleteEntry = (uuid, callback) => {
  Entry.findOne({
    uuid: uuid
  }).remove(callback);
}

module.exports.sync = (time, entries, callback) => {
  if (entries && JSON.parse(entries).length !== 0) {
    console.log("SYNCING");
    module.exports.syncEntries(JSON.parse(entries), (err) => {
      if (err) {
        callback(err, null);
      } else {
        console.log("POST");
        Entry.find({
          modifiedDate: {
            $gt: time
          }
        }, callback);
      }
    });
  } else {
      console.log("POSTB");
    Entry.find({
      modifiedDate: {
        $gt: time
      }
    }, callback);
  }
}

module.exports.getPending = (callback) => {
  Entry.find({
    status: 'PENDING'
  }, callback);
}

module.exports.getCompleted = (callback) => {
  Entry.find({
    status: 'COMPLETED'
  }, callback);
}

module.exports.getActive = (callback) => {
  Entry.find({
    status: 'PENDING'
  }, (err, entries) => {
    if (err) callback(err, none);
    else {
      var active = []
      for (var entry in entries) {
        if (entries[entry].times != '[]') {
          var times = JSON.parse(entries[entry].times);
          if (times[times.length - 1].length != 2) {
            active.push(entries[entry]);
          }
        }
      }
      callback(null, active);
    }
  });
}

module.exports.get = (uuid, callback) => {
  Entry.findOne({
    uuid: uuid
  }, callback);
}

module.exports.getProject = (project, status, callback) => {
  Entry.find(status ? {
    projects: project,
    status: status
  } : {
    projects: project
  }, callback);
}
module.exports.getTag = (tag, status, callback) => {
  Entry.find(status ? {
    tags: tag,
    status: status
  } : {
    tags: tags
  }, callback);
}

module.exports.serialize = (entry) => {
  return {
    title: entry.title,
    projects: entry.projects,
    tags: entry.tags,
    priority: entry.priority,
    entryDate: entry.entryDate,
    dueDate: entry.dueDate,
    doneDate: entry.doneDate,
    modifiedDate: entry.modifiedDate,
    status: entry.status,
    times: JSON.parse(entry.times),
    uuid: entry.uuid
  };
}
