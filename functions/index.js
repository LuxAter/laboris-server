const admin = require("firebase-admin");
const functions = require("firebase-functions");
const uuidv5 = require("uuid/v5");
const serviceAccount = require("./laboris-dc537-firebase-adminsdk-jecpz-9c6f7b8246.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://laboris-dc537.firebaseio.com"
});

let db = admin.firestore();
let users = db.collection("users");

createUser = functions.https.onRequest((req, res) => {
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
deleteUser = functions.https.onRequest((req, res) => {
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

queryUser = functions.https.onRequest((req, res) => {
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
listUsers = functions.https.onRequest((req, res) => {
  return users.get().then(snapshot => {
    let users = {};
    snapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });
    return res.json(users);
  });
});

exports.user = functions.https.onRequest((req, res) => {
  console.log(req.path);
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
