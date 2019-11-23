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
  if (uuid === undefined)
    return new Promise((resolve, reject) => {
      resolve(false);
    });
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
        users.doc(uuid).set({ email: email });
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

dbParseQueryParams = req => {
  const params = _.merge(req.body, req.query);
  const filter = {
    state: params.state !== undefined ? params.state !== "false" : undefined,
    priority: params.priority ? _.toInteger(params.priority) : undefined,
    priority_gt: params.priority_gt
      ? _.toInteger(params.priority_gt)
      : undefined,
    priority_lt: params.priority_lt
      ? _.toInteger(params.priority_lt)
      : undefined,
    priority_ge: params.priority_ge
      ? _.toInteger(params.priority_ge)
      : undefined,
    priority_le: params.priority_le
      ? _.toInteger(params.priority_le)
      : undefined,
    hidden: params.hidden !== undefined ? params.hidden !== "false" : undefined,
    entryDate: params.entryDate ? _.toInteger(params.entryDate) : undefined,
    entryDate_gt: params.entryDate_gt
      ? _.toInteger(params.entryDate_gt)
      : undefined,
    entryDate_lt: params.entryDate_lt
      ? _.toInteger(params.entryDate_lt)
      : undefined,
    entryDate_ge: params.entryDate_ge
      ? _.toInteger(params.entryDate_ge)
      : undefined,
    entryDate_le: params.entryDate_le
      ? _.toInteger(params.entryDate_le)
      : undefined,
    dueDate: params.dueDate ? _.toInteger(params.dueDate) : undefined,
    dueDate_gt: params.dueDate_gt ? _.toInteger(params.dueDate_gt) : undefined,
    dueDate_lt: params.dueDate_lt ? _.toInteger(params.dueDate_lt) : undefined,
    dueDate_ge: params.dueDate_ge ? _.toInteger(params.dueDate_ge) : undefined,
    dueDate_le: params.dueDate_le ? _.toInteger(params.dueDate_le) : undefined,
    doneDate: params.doneDate ? _.toInteger(params.doneDate) : undefined,
    doneDate_gt: params.doneDate_gt
      ? _.toInteger(params.doneDate_gt)
      : undefined,
    doneDate_lt: params.doneDate_lt
      ? _.toInteger(params.doneDate_lt)
      : undefined,
    doneDate_ge: params.doneDate_ge
      ? _.toInteger(params.doneDate_ge)
      : undefined,
    doneDate_le: params.doneDate_le
      ? _.toInteger(params.doneDate_le)
      : undefined,
    modifiedDate: params.modifiedDate
      ? _.toInteger(params.modifiedDate)
      : undefined,
    modifiedDate_gt: params.modifiedDate_gt
      ? _.toInteger(params.modifiedDate_gt)
      : undefined,
    modifiedDate_lt: params.modifiedDate_lt
      ? _.toInteger(params.modifiedDate_lt)
      : undefined,
    modifiedDate_ge: params.modifiedDate_ge
      ? _.toInteger(params.modifiedDate_ge)
      : undefined,
    modifiedDate_le: params.modifiedDate_le
      ? _.toInteger(params.modifiedDate_le)
      : undefined,
    parents: params.parents
      ? _.compact(_.castArray(params.parents))
      : undefined,
    children: params.children
      ? _.compact(_.castArray(params.children))
      : undefined,
    tags: params.tags ? _.compact(_.castArray(params.tags)) : undefined
  };
};

dbConstructQuery = (uuid, filter) => {
  let dbQuery = tasks.where("users", "array-contains", uuid);
  if (filter.state) dbQuery = dbQuery.where("state", "==", filter.state);
  if (filter.priority)
    dbQuery = dbQuery.where("priority", "==", filter.priority);
  if (filter.priority_gt)
    dbQuery = dbQuery.where("priority", ">", filter.priority_gt);
  if (filter.priority_lt)
    dbQuery = dbQuery.where("priority", "<", filter.priority_lt);
  if (filter.priority_ge)
    dbQuery = dbQuery.where("priority", ">=", filter.priority_ge);
  if (filter.priority_le)
    dbQuery = dbQuery.where("priority", "<=", filter.priority_le);
  if (filter.hidden) dbQuery = dbQuery.where("hidden", "==", filter.hidden);
  if (filter.entryDate)
    dbQuery = dbQuery.where("entryDate", "==", filter.entryDate);
  if (filter.entrydate_gt)
    dbQuery = dbQuery.where("entryDate", ">", filter.entryDate_gt);
  if (filter.entryDate_lt)
    dbQuery = dbQuery.where("entryDate", "<", filter.entryDate_lt);
  if (filter.entryDate_ge)
    dbQuery = dbQuery.where("entryDate", ">=", filter.entryDate_ge);
  if (filter.entryDate_le)
    dbQuery = dbQuery.where("entryDate", "<=", filter.entryDate_le);
  if (filter.dueDate) dbQuery = dbQuery.where("dueDate", "==", filter.dueDate);
  if (filter.dueDate_gt)
    dbQuery = dbQuery.where("dueDate", ">", filter.dueDate_gt);
  if (filter.dueDate_lt)
    dbQuery = dbQuery.where("dueDate", "<", filter.dueDate_lt);
  if (filter.dueDate_ge)
    dbQuery = dbQuery.where("dueDate", ">=", filter.dueDate_ge);
  if (filter.dueDate_le)
    dbQuery = dbQuery.where("dueDate", "<=", filter.dueDate_le);
  if (filter.doneDate)
    dbQuery = dbQuery.where("doneDate", "==", filter.doneDate);
  if (filter.doneDate_gt)
    dbQuery = dbQuery.where("doneDate", ">", filter.doneDate_gt);
  if (filter.doneDate_lt)
    dbQuery = dbQuery.where("doneDate", "<", filter.doneDate_lt);
  if (filter.doneDate_ge)
    dbQuery = dbQuery.where("doneDate", ">=", filter.doneDate_ge);
  if (filter.doneDate_le)
    dbQuery = dbQuery.where("doneDate", "<=", filter.doneDate_le);
  if (filter.modifiedDate)
    dbQuery = dbQuery.where("modifiedDate", "==", filter.modifiedDate);
  if (filter.modifiedDate_gt)
    dbQuery = dbQuery.where("modifiedDate", ">", filter.modifiedDate_gt);
  if (filter.modifiedDate_lt)
    dbQuery = dbQuery.where("modifiedDate", "<", filter.modifiedDate_lt);
  if (filter.modifiedDate_ge)
    dbQuery = dbQuery.where("modifiedDate", ">=", filter.modifiedDate_ge);
  if (filter.modifiedDate_le)
    dbQuery = dbQuery.where("modifiedDate", "<=", filter.modifiedDate_le);
  return dbSearch(
    _.compact(_.uniq(_.concat(filter.parents, filter.children))),
    uuid,
    {}
  )
    .then(queryResults => {
      if (filter.parents)
        filter.parents = _.compact(
          _.map(filter.parents, key =>
            queryResults[key].length !== 0
              ? queryResults[key][0].uuid
              : undefined
          )
        );
      if (filter.children)
        filter.children = _.compact(
          _.map(filter.children, key =>
            queryResults[key].length !== 0
              ? queryResults[key][0].uuid
              : undefined
          )
        );
      return dbQuery.get();
    })
    .then(snapshot => {
      let data = [];
      snapshot.forEach(doc => {
        if (
          (filter.parents
            ? _.difference(filter.parents, doc.data().parents).length === 0
            : true) &&
          (filter.children
            ? _.difference(filter.children, doc.data().children).length === 0
            : true) &&
          (filter.tags
            ? _.difference(filter.tags, doc.data().tags).length === 0
            : true)
        )
          data.push(doc);
      });
      return data;
    });
};

dbSearch = (
  query,
  uuid,
  filter,
  keys = ["id", "title", "parents", "children", "tags"]
) => {
  if (query.length === 0)
    return new Promise((resolve, reject) => {
      resolve({});
    });
  return dbConstructQuery(uuid, filter).then(data => {
    var fuse = new Fuse(data, {
      shouldSort: true,
      threshold: 0.3,
      location: 0,
      distance: 256,
      maxPatternLength: 32,
      keys: keys
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
    state: true,
    times: []
  };
  if (task.title.length === 0)
    return res.json({ error: "task title is required to create a task" });
  return dbSearch(
    _.uniq(_.concat(task.parents, task.children)),
    req.query.token,
    {}
  ).then(queryResults => {
    let uuid = uuidv5(
      task.title + req.query.token + task.entryDate.toString(),
      uuidv5.URL
    );
    try {
      task.parents = _.map(task.parents, key => queryResults[key][0].uuid);
      task.children = _.map(task.children, key => queryResults[key][0].uuid);
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
deleteTask = (req, res) => {
  if (!req.body.uuid)
    return res.json({ error: "task uuid is required to delete a task" });
  return tasks
    .where(admin.firestore.FieldPath.documentId(), "==", req.body.uuid)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) return res.json({ error: "task does not exist" });
      snapshot.forEach(doc => {
        const id = doc.id;
        const data = doc.data();
        data.parents.forEach(id => {
          tasks
            .doc(id)
            .update({ children: admin.firestore.FieldValue.arrayRemove(id) });
        });
        data.children.forEach(id => {
          tasks
            .doc(id)
            .update({ parents: admin.firestore.FieldValue.arrayRemove(id) });
        });
      });
      doc.delete();
      return res.json({ msg: "deleted task" });
    });
};
openTask = (req, res) => {
  let filter = dbParseQueryParams(req);
  filter.state = false;
  return dbConstructQuery(req.query.token, filter).then(dbResponse => {
    if (dbResponse.length === 0) return res.json({ error: "task not found" });
    else if (dbResponse.length > 1)
      return res.json({
        error: "found multiple tasks for search",
        data: dbResponse.map(doc => _.set(doc.data(), "uuid", doc.id))
      });
    let doc = dbResponse[0];
    doc.update({ state: true });
    return res.json({
      msg: "opened task",
      data: _.set(doc.data(), "uuid", doc.id)
    });
  });
};
closeTask = (req, res) => {
  let filter = dbParseQueryParams(req);
  filter.state = true;
  return dbConstructQuery(req.query.token, filter).then(dbResponse => {
    if (dbResponse.length === 0) return res.json({ error: "task not found" });
    else if (dbResponse.length > 1)
      return res.json({
        error: "found multiple tasks for search",
        data: dbResponse.map(doc => _.set(doc.data(), "uuid", doc.id))
      });
    let doc = dbResponse[0];
    if (doc.data().times.length % 2 === 0)
      doc.update({
        state: false,
        times: admin.firestore.FieldValue.arrayUnion(
          admin.firestore.FieldValue.serverTimestamp()
        )
      });
    else doc.update({ state: false });
    return res.json({
      msg: "closed task",
      data: _.set(doc.data(), "uuid", doc.id)
    });
  });
};
startTask = (req, res) => {
  let filter = dbParseQueryParams(req);
  filter.state = true;
  return dbConstructQuery(req.query.token, filter).then(dbResponse => {
    if (dbResponse.length === 0) return res.json({ error: "task not found" });
    else if (dbResponse.length > 1)
      return res.json({
        error: "found multiple tasks for search",
        data: dbResponse.map(doc => _.set(doc.data(), "uuid", doc.id))
      });
    let doc = dbResponse[0];
    if (doc.data().times.length % 2 !== 0)
      return res.json({ error: "task already active" });
    doc.update({
      times: admin.firestore.FieldValue.arrayUnion(
        admin.firestore.FieldValue.serverTimestamp()
      )
    });
    return res.json({
      msg: "started task",
      data: _.set(doc.data(), "uuid", doc.id)
    });
  });
};
stopTask = (req, res) => {
  let filter = dbParseQueryParams(req);
  filter.state = true;
  return dbConstructQuery(req.query.token, filter).then(dbResponse => {
    if (dbResponse.length === 0) return res.json({ error: "task not found" });
    else if (dbResponse.length > 1)
      return res.json({
        error: "found multiple tasks for search",
        data: dbResponse.map(doc => _.set(doc.data(), "uuid", doc.id))
      });
    let doc = dbResponse[0];
    if (doc.data().times.length % 2 === 0)
      return res.json({ error: "task is not active" });
    doc.update({
      times: admin.firestore.FieldValue.arrayUnion(
        admin.firestore.FieldValue.serverTimestamp()
      )
    });
    return res.json({
      msg: "stopped task",
      data: _.set(doc.data(), "uuid", doc.id)
    });
  });
};
listTasks = (req, res) => {
  let filter = dbParseQueryParams(req);
  return dbConstructQuery(req.query.token, filter).then(dbResponse => {
    return res.json(dbResponse.map(doc => _.set(doc.data(), "uuid", doc.id)));
  });
};
nullTask = (req, res) => {
  return res.send("HELLO WORLD!");
};

exports.task = functions.https.onRequest((req, res) => {
  const targets = [
    [/\/create\/?.*/, ["POST"], createTask],
    [/\/delete\/?.*/, ["POST"], deleteTask],
    [/\/open\/?.*/, ["POST"], openTask],
    [/\/close\/?.*/, ["POST"], closeTask],
    [/\/start\/?.*/, ["POST"], startTask],
    [/\/stop\/?.*/, ["POST"], stopTask],
    [/\/?.*/, ["POST", "GET"], listTasks]
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
