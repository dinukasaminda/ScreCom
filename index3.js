var stdin = process.stdin;
stdin.setEncoding("utf8");

setInterval(() => {
  if (!readingFromUser) {
    console.log("MESSAGE RECEIVED FROM [NAME] : Hi . ");
  } else {
    unreadMsgs.push("MESSAGE RECEIVED FROM [NAME] : Hi . ");
  }
}, 1000);

var unreadMsgs = [];
const popAllUnreadList = () => {
  const len = unreadMsgs.length;
  for (var i = 0; i < len; i++) {
    if (unreadMsgs.length < i) {
      console.log(unreadMsgs.shift());
    }
  }
};
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
//process.stdin.setRawMode(true);

var readingFromUser = false;
process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else {
    if ((key.name = "enter")) {
      if (readingFromUser) {
        readingFromUser = false;
      } else {
        readingFromUser = true;
        console.log("ENTER MESSAGE: ");
        var line = process.readline();
        console.log("SENT [ME] MESSAGE: " + line);
        popAllUnreadList();
      }
    }
  }
});
console.log("Press any key...");
