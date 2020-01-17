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

const userCreate = (req, res) => {
  return db.collection('users').doc(req.body.email).get().then(userSnap => {
    if (userSnap.exists)
      return res.json({error: `Email "${req.body.email}" already in use`});
    return bcrypt.hash(req.body.password, 10).then(hash => {
      const uuid = uuidv5(req.body.email + hash, uuidv5.URL);
      return db.collection('users')
          .doc(uuid)
          .set({email: req.body.email, uuid: uuid, password: hash})
          .then(_response => {
            return res.json({
              success: `Created new user for "${req.body.email}`,
              email: req.body.email,
              uuid: uuid
            });
          });
    });
  });
};

const userSignin = (req, res) => {
  return db.collection('users')
      .where('email', '==', req.body.email)
      .get()
      .then(snapshot => {
        if (snapshot.empty)
          return res.json({error: `No user with email "${req.body.email}"`});
        return snapshot.forEach(doc => {
          const data = doc.data();
          return bcrypt.compare(req.body.password, data.password)
              .then(match => {
                if (match)
                  return res.json({
                    success: `Signed in as "${req.body.email}"`,
                    uuid: data.uuid
                  });
                return res.json(
                    {error: `Incorrect password for "${req.body.email}"`});
              });
        });
      });
};

const invalidAPI = (req, res) => {
  return res.json({error: `Invalid API target ${req.path}`});
};

const userGet = (req, res) => {
  return invalidAPI(req, res);
};
const userPost = (req, res) => {
  if (req.path === '/create/')
    return userCreate(req, res);
  else if (req.path === '/signin/')
    return userSignin(req, res);
  else
    return invalidAPI(req, res);
};

exports.user = functions.https.onRequest((req, res) => {
  if (req.method === 'GET')
    return userGet(req, res);
  else if (req.method === 'POST')
    return userPost(req, res);
  else
    return invalidAPI(req, res);
});

const taskPull = (req, res) => {
  return db.collection('users')
      .doc(req.query.user)
      .collection('tasks')
      .doc(req.query.task)
      .get()
      .then(doc => {
        return res.json(doc.data());
      });
};
const taskPush = (req, res) => {
  return db.collection('users')
      .doc(req.query.user)
      .collection('tasks')
      .doc(req.query.task)
      .set(req.body)
      .then(doc => {
        return res.json(req.body);
      });
};

const taskDelete = (req, res) => {
  return db.collection('users')
      .doc(req.query.user)
      .collection('tasks')
      .doc(req.query.task)
      .delete()
      .then(_res => {
        return res.json({success: 'Deleted task'});
      });
};

const taskGet = (req, res) => {
  if (req.path === '/pull/') return taskPull(req, res);
  return invalidAPI(req, res);
};
const taskPost = (req, res) => {
  if (req.path === '/push/')
    return taskPush(req, res);
  else if (req.path === '/delete/')
    return taskDelete(req, res);
  return invalidAPI(req, res);
};

exports.tasks = functions.https.onRequest((req, res) => {
  if (req.method === 'GET')
    return taskGet(req, res);
  else if (req.method === 'POST')
    return taskPost(req, res);
  else
    return invalidAPI(req, res);
});