const _ = require('lodash');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const bcrypt = require('bcrypt');
const uuidv5 = require('uuid/v5');

const serviceAccount =
    require('./laboris-dc537-firebase-adminsdk-jecpz-9c6f7b8246.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://laboris-dc537.firebaseio.com'
});

let db = admin.firestore();
let users = db.collection('users');
let tasks = db.collection('tasks');

exports.user = functions.https.onRequest((req, res) => {
  if (req.method === 'POST') {
    if (req.path === '/create/') {
      return users.doc(req.body.email).get().then(docSnap => {
        if (docSnap.exists)
          return res.json({error: `Email "${req.body.email} already in use`});
        return bcrypt.hash(req.body.password, 10).then(hash => {
          const userUuid = uuidv5(req.body.email + hash, uuidv5.URL);
          return users.doc(req.body.email)
              .set({email: req.body.email, password: hash, uuid: userUuid})
              .then(_writeRes => {
                return res.json({
                  success: `Created new user for "${req.body.email}`,
                  email: req.body.email,
                  uuid: userUuid
                });
              });
        });
      });
    } else if (req.path === '/signin/') {
      return users.doc(req.body.email).get().then(docSnap => {
        if (!docSnap.exists)
          return res.json({error: `No user with email: "${req.body.email}"`});
        const doc = docSnap.data();
        return bcrypt.compare(req.body.password, doc.password).then(match => {
          if (match)
            return res.json(
                {success: `Signed on as "${req.body.email}"`, uuid: doc.uuid});
          else
            return res.json(
                {error: `Incorrect password for "${req.body.email}"`});
        });
      });
    } else {
      return res.json({error: 'endpoint not found'});
    }
  } else {
    return res.json({error: 'endpoint not found'});
  }
});

exports.task = functions.https.onRequest((req, res) => {
  if (req.query.uuid !== undefined) {
    if (req.method === 'GET') {
      return tasks.doc(req.query.uuid).get().then(doc => {
        return res.json(doc.data());
      });
    } else if (req.method === 'POST') {
      return tasks.doc(req.query.uuid).get().then(docSnap => {
        if (docSnap.exists) {
          const doc = docSnap.data();
          if (req.body.syncTime > doc.modifiedDate) {
            tasks.doc(req.query.uuid).set(req.body);
            return res.json(req.body);
          } else {
            let joint = {};
            for (const key of _.uniq(
                     _.concat(Object.keys(doc), Object.keys(req.body)))) {
              if (key in doc && key in req.body && !_.isArray(doc)) {
                joint[key] = req.body[key];
              } else if (key in doc && key in req.body) {
                joint[key] = _.uniq(_.concat(doc[key], req.body[key])).sort();
              } else if (key in doc) {
                joint[key] = doc[key];
              } else {
                joint[key] = req.body[key];
              }
            }
            console.log(req.query.uuid, JSON.stringify(joint));
            tasks.doc(req.query.uuid).set(joint);
            return res.json(joint);
          }
        } else {
          tasks.doc(req.query.uuid).set(req.body);
          return res.json(req.body);
        }
      });
    } else {
      return res.json({error: 'endpoint not found'});
    }
  } else if (req.method === 'GET') {
    return tasks.get().then(snapshot => {
      let docs = {};
      snapshot.forEach(doc => {
        docs[doc.id] = doc.data();
      });
      return res.json(docs);
    });
  } else {
    return res.json({error: 'endpoint not found'});
  }
});
