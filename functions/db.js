const admin = require("firebase-admin");
const serviceAccount = require("./laboris-dc537-firebase-adminsdk-jecpz-9c6f7b8246.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://laboris-dc537.firebaseio.com"
});

let db = admin.firestore();
let users = db.collection("users");
let tasks = db.collection("tasks");

module.export.queryUser = uuid => {
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
module.export.getUser = email => {
  return users
    .where("email", "==", email)
    .limit(1)
    .get();
};
