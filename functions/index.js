const admin = require("firebase-admin");
const functions = require("firebase-functions");
const uuidv5 = require("uuid/v5");

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();
let users = db.collection("users");
let tasks = db.collection("tasks");

exports.users = functions.https.onRequest((req, res) => {
  if (req.method !== "GET")
    return res.status(400).send("POST not supported for this endpoint");
  return users.get().then(snapshot => {
    let users = {};
    snapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });
    return res.json(users);
  });
});
exports.user = functions.https.onRequest((req, res) => {
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
});
exports.createUser = functions.https.onRequest((req, res) => {
  if (req.method !== "POST")
    return res.status(400).send("GET not supported for this endpoint");
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
        return res.json({ uuid: uuid, email: email, msg: "created new user" });
      }
      return res.json({ error: "user already exists" });
    })
    .catch(err => {
      return res.json({ error: err });
    });
});
exports.deleteUser = functions.https.onRequest((req, res) => {
  if (req.method !== "POST")
    return res.status(400).send("GET not supported for this endpoint");
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
});
