const _ = require('lodash');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const serviceAccount =
    require('./laboris-dc537-firebase-adminsdk-jecpz-9c6f7b8246.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://laboris-dc537.firebaseio.com'
});

let db = admin.firestore();
let tasks = db.collection('tasks');


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
