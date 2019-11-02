const _ = require("lodash");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const uuidv5 = require("uuid/v5");
const Fuse = require("fuse.js");

const serviceAccount = require("./laboris-dc537-firebase-adminsdk-jecpz-9c6f7b8246.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://laboris-dc537.firebaseio.com"
});

let db = admin.firestore();
let users = db.collection("users");
let tasks = db.collection("tasks");

dbValidUser = uuid => {
  return users
    .doc(uuid)
    .get()
    .then(doc => {
      if (!doc.data()) return false;
      return true;
    });
};

createUser = (req, res) => {
  let email = req.body.email || "";
  let firstName = req.body.firstName || "";
  let lastName = req.body.lastName || "";
  let uuid = uuidv5(email, uuidv5.URL);
  if (
    email.length === 0 ||
    !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  )
    return res.json({ error: "invalid email format" });
  return users
    .where("email", "==", email)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        users
          .doc(uuid)
          .set({ email: email, firstName: firstName, lastName: lastName });
        return res.json({
          user: { uuid: uuid, email: email },
          msg: "created new user"
        });
      }
      return res.json({ error: "user already exists" });
    })
    .catch(err => {
      return res.json({ error: err });
    });
};
deleteUser = (req, res) => {
  let email = req.body.email || req.query.email;
  if (
    email.length === 0 ||
    !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  )
    return res.json({ error: "invalid email format" });
  return users
    .where("email", "==", email)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) return res.json({ error: "user does not exist" });
      snapshot.forEach(doc => {
        users.doc(doc.id).delete();
      });
      return res.json({ msg: "deleted user" });
    });
};

queryUser = (req, res) => {
  let email = req.body.email || req.query.email || "";
  if (
    email.length === 0 ||
    !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  )
    return res.json({ error: "invalid email format" });
  return users
    .doc(uuidv5(email, uuidv5.URL))
    .get()
    .then(doc => {
      if (!doc.data()) return res.json({ error: "user does not exist" });
      return res.json({ uuid: doc.id, email: email });
    })
    .catch(_ => {
      return res.json({ error: "user does not exist" });
    });
};
listUsers = (req, res) => {
  return users.get().then(snapshot => {
    let users = {};
    snapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });
    return res.json(users);
  });
};

exports.user = functions.https.onRequest((req, res) => {
  const targets = [
    [/\/create\/?.*/, ["POST"], createUser],
    [/\/delete\/?.*/, ["POST"], deleteUser],
    [/\/list\/?.*/, ["GET"], listUsers],
    [/\//, ["POST", "GET"], queryUser]
  ];
  for (const i in targets) {
    if (req.path.match(targets[i][0]) && targets[i][1].includes(req.method))
      return targets[i][2](req, res);
    else if (req.path.match(targets[i][0]))
      return res.json({
        error: `endpoint ${targets[i][0].toString()} expects ${JSON.stringify(
          targets[i][1]
        )} not ${req.method}`
      });
  }
  return res.json({ error: `endpoint not found for ${req.path}` });
});

dbQuery = (query, uuid, filter) => {
  if (query.length === 0)
    return new Promise((resolve, reject) => {
      resolve({});
    });
  let dbQuery = tasks.where("users", "array-contains", uuid);
  if ("parents" in filter)
    for (const id in filter.parents) {
      dbQuery = dbQuery.where("parents", "array-contains", filter.parents[id]);
    }
  if ("children" in filter)
    for (const id in filter.children) {
      dbQuery = dbQuery.where(
        "children",
        "array-contains",
        filter.children[id]
      );
    }
  if ("tags" in filter)
    for (const id in filter.tags) {
      dbQuery = dbQuery.where("tags", "array-contains", filter.tags[id]);
    }
  if ("priority" in filter)
    dbQuery = dbQuery.wher("priority", "==", filter.priority);
  if ("priority_gt" in filter)
    dbQuery = dbQuery.wher("priority", ">", filter.priority_gt);
  if ("priority_lt" in filter)
    dbQuery = dbQuery.wher("priority", "<", filter.priority_lt);
  if ("priority_ge" in filter)
    dbQuery = dbQuery.wher("priority", ">=", filter.priority_ge);
  if ("priority_le" in filter)
    dbQuery = dbQuery.wher("priority", "<=", filter.priority_le);
  if ("hidden" in filter)
    dbQuery = dbQuery.where("hidden", "==", filter.hidden);
  if ("entryDate" in filter)
    dbQuery = dbQuery.where("entryDate", "==", filter.entryDate);
  if ("entryDate_gt" in filter)
    dbQuery = dbQuery.where("entryDate", ">", filter.entryDate_gt);
  if ("entryDate_lt" in filter)
    dbQuery = dbQuery.where("entryDate", "<", filter.entryDate_lt);
  if ("entryDate_ge" in filter)
    dbQuery = dbQuery.where("entryDate", ">=", filter.entryDate_ge);
  if ("entryDate_le" in filter)
    dbQuery = dbQuery.where("entryDate", "<=", filter.entryDate_le);
  if ("dueDate" in filter)
    dbQuery = dbQuery.where("dueDate", "==", filter.dueDate);
  if ("dueDate_gt" in filter)
    dbQuery = dbQuery.where("dueDate", ">", filter.dueDate_gt);
  if ("dueDate_lt" in filter)
    dbQuery = dbQuery.where("dueDate", "<", filter.dueDate_lt);
  if ("dueDate_ge" in filter)
    dbQuery = dbQuery.where("dueDate", ">=", filter.dueDate_ge);
  if ("dueDate_le" in filter)
    dbQuery = dbQuery.where("dueDate", "<=", filter.dueDate_le);
  if ("doneDate" in filter)
    dbQuery = dbQuery.where("doneDate", "==", filter.doneDate);
  if ("doneDate_gt" in filter)
    dbQuery = dbQuery.where("doneDate", ">", filter.doneDate_gt);
  if ("doneDate_lt" in filter)
    dbQuery = dbQuery.where("doneDate", "<", filter.doneDate_lt);
  if ("doneDate_ge" in filter)
    dbQuery = dbQuery.where("doneDate", ">=", filter.doneDate_ge);
  if ("doneDate_le" in filter)
    dbQuery = dbQuery.where("doneDate", "<=", filter.doneDate_le);
  return dbQuery.get().then(snapshot => {
    let data = [];
    snapshot.forEach(doc => {
      let tmp = doc.data();
      tmp.id = doc.id;
      data.push(tmp);
    });
    var fuse = new Fuse(data, {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 256,
      maxPatternLength: 32,
      keys: ["id", "title", "parents", "children", "tags", "users"]
    });
    let results = {};
    if (_.isArray(query)) {
      query.forEach(queryStr => {
        results[queryStr] = fuse.search(queryStr);
      });
    } else {
      results = fuse.search(query);
    }
    return results;
  });
};

createTask = (req, res) => {
  console.log(JSON.stringify(req.body));
  let task = {
    title: req.body.title || "",
    parents: _.compact(_.castArray(req.body.parents)),
    children: _.compact(_.castArray(req.body.children)),
    users: _.concat(_.compact(_.castArray(req.body.users)), req.query.token),
    tags: _.compact(_.castArray(req.body.tags)),
    priority: _.toInteger(req.body.priority || 5),
    hidden: req.body.hidden || false,
    entryDate: _.now(),
    modifiedDate: _.now(),
    dueDate: req.body.dueDate ? _.toInteger(req.body.dueDate) : null,
    doneDate: null,
    times: []
  };
  if (task.title.length === 0)
    return res.json({ error: "task title is required to create a task" });
  return dbQuery(
    _.uniq(_.concat(task.parents, task.children)),
    req.query.token,
    {}
  ).then(queryResults => {
    let uuid = uuidv5(
      task.title + req.query.token + task.entryDate.toString(),
      uuidv5.URL
    );
    try {
      task.parents = _.map(task.parents, key => queryResults[key][0].id);
      task.children = _.map(task.children, key => queryResults[key][0].id);
    } catch (err) {
      return res.json({ err: "parent/child task could not be found" });
    }
    task.parents.forEach(id => {
      tasks
        .doc(id)
        .update({ children: admin.firestore.FieldValue.arrayUnion(uuid) });
    });
    task.children.forEach(id => {
      tasks
        .doc(id)
        .update({ parents: admin.firestore.FieldValue.arrayUnion(uuid) });
    });
    tasks.doc(uuid).set(task);
    task.uuid = uuid;
    return res.json({ task: task, msg: "created new task" });
  });
};
nullTask = (req, res) => {
  return res.send("HELLO WORLD!");
};

exports.task = functions.https.onRequest((req, res) => {
  const targets = [
    [/\/create\/?.*/, ["POST"], createTask],
    [/\/delete\/?.*/, ["POST"], nullTask],
    [/\/open\/?.*/, ["POST"], nullTask],
    [/\/close\/?.*/, ["POST"], nullTask],
    [/\/start\/?.*/, ["POST"], nullTask],
    [/\/stop\/?.*/, ["POST"], nullTask],
    [/\/?.*/, ["POST", "GET"], nullTask]
  ];
  return dbValidUser(req.query.token).then(valid => {
    if (!valid) return res.json({ error: "user token is not valid" });
    for (const i in targets) {
      if (req.path.match(targets[i][0]) && targets[i][1].includes(req.method))
        return targets[i][2](req, res);
      else if (req.path.match(targets[i][0]))
        return res.json({
          error: `endpoint ${targets[i][0].toString()} expects ${JSON.stringify(
            targets[i][1]
          )} not ${req.method}`
        });
    }
    return res.json({ error: `endpoint not found for ${req.path}` });
  });
});
