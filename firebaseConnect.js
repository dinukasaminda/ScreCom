var admin = require("firebase-admin");

var serviceAccount = require("./firebaseAuth/aaa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aaa.firebaseio.com"
});
const db = admin.database();
db.ref("chatRooms/a").on("child_added", snapshot => {
  /*  unreadMsgs.push("MESSAGE [NAME]:\n Hi . ");

  if (!readingFromUser) {
    popAllUnreadList();
  } else {
    //console.log("pushed");
  }*/
});
db.ref("chatRooms/a").push({
  date: Date.now()
});

/*
{
    dataType: msg  | public key exchange | delete oldchat
    from: user_UUID,
    to: user_UUID,
    timestamp,
    data:{
        msg  | public key exchange | delete oldchat
    }
}


on /public/data.json

last resived chatroom notification id
*/
