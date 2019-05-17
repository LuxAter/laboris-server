var express = require('express');

var Entry = require('../models/entry.js');

var router = express.Router();


router.get('/', (req, res, next) => {
  Entry.getPending((err, entries) => {
    if (err) res.json({
      'error': err
    });
    else res.json(entries.map(ent => Entry.serialize(ent)));
  });
});

router.get('/pending', (req, res, next) => {
  Entry.getPending((err, entries) => {
    if (err) res.json({
      'error': err
    });
    else res.json(entries.map(ent => Entry.serialize(ent)));
  });
});

router.get('/completed', (req, res, next) => {
  Entry.getCompleted((err, entries) => {
    if (err) res.json({
      'error': err
    });
    else res.json(entries.map(ent => Entry.serialize(ent)));
  });
});

router.get('/active', (req, res, next) => {
  Entry.getActive((err, entries) => {
    if (err) res.json({
      'error': err
    });
    else res.json(entries.map(ent => Entry.serialize(ent)));
  });
});

router.get('/uuid/:uuid', (req, res, next) => {
  Entry.get(req.params.uuid, (err, entry) => {
    if (err) res.json({
      'error': err
    });
    else res.json(Entry.serialize(entry));
  });
});

router.post('/sync', (req, res, next) => {
  Entry.sync(req.body.datetime, (err, entries) => {
    if(err) res.json({'error': err});
    else res.json(entries.map(ent => Entry.serialize(ent)));
  })
});

router.post('/', (req, res, next) => {
  var entry = {
    title: req.body.title,
    projects: req.body.projects,
    tags: req.body.tags,
    priority: req.body.priority,
    dueDate: req.body.dueDate
  };
  if (req.body.uuid) {
    entry.entryDate = req.body.entryDate;
    entry.doneDate = req.body.doneDate;
    entry.modifiedDate = req.body.modifiedDate;
    entry.status = req.body.status;
    entry.times = JSON.stringify(req.body.times);
    entry.uuid = req.body.uuid;
    Entry.syncEntry(entry.uuid, entry, (err, db_entry) => {
      if (err) res.json({
        'error': err,
        'success': false
      });
      else res.json({
        'success': true,
        'entry': Entry.serialize(db_entry)
      });
    });
  } else {
    Entry.createEntry(entry, (err, db_entry) => {
      if (err) res.json({
        'error': err,
        'success': false
      });
      else res.json({
        'success': true,
        'entry': Entry.serialize(db_entry)
      });
    });
  }
});

router.post('/update/:uuid', (req, res, next) => {
  Entry.syncEntry(req.params.uuid, req.body, (err, success) => {
    if (err) res.json({
      'error': err,
      'success': false
    });
    else res.json({
      'success': success
    });
  });
});

module.exports = router;
