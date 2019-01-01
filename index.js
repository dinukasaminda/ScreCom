const readline = require("readline");
const eFire = require("./eFire");
const rl = readline.createInterface(process.stdin, process.stdout);
var readingFromUser = false;
var unreadMsgs = [];

rl.setPrompt("@USER>");
rl.prompt();

var privateKey = "";

var profile = {
  name: "",
  id: "",
  chatRooms: []
};

var publicKey = "";

var chatRoom = {
  chatRoomId: "",
  lastReadMsgKey: "",
  name: "",
  chatrooms: [
    //{chatroom,name,users:[{id,name,publicKey}]}
  ]
};

var lastState = "gfg";
var lastData = {};

const init = () => {
  profile = eFire.fileToJson("./public/data.json");
  if (profile == null) {
    console.log("Profile not found");
    rl.prompt();
    return;
  }
  profile.publicKey = eFire.fileToStr("./keys/publicKey.txt");
  if (profile.publicKey == null) {
    console.log("Keys not found");
    rl.prompt();
    return;
  }
  console.log(profile);
  rl.prompt();
};
init();
rl.on("line", line => {
  if (line.length < 1) {
    if (!readingFromUser) {
      readingFromUser = true;
    }
  } else {
    var line = "" + line.trim();

    if (line.startsWith("efire create profile")) {
      var args = line.split(" ");
      if (args.length == 4) {
        var userName = args[3];
        lastData = { userName: userName };
        rl.prompt();
        console.log("Confirm to create and overwrite existing profile [y/n]:");
        lastState = "efire_create_profile";
      }
    } else if (line == "y" && lastState == "efire_create_profile") {
      eFire.createScreComProfile(lastData.userName, "./public/data.json");
      lastState = "efire_create_profile_y";
      lastData = {};
      rl.prompt();
    } else if (line.startsWith("efire profile")) {
      console.log("Your Profile:");
      console.log(profile);
      rl.prompt();
      lastState = "efire_profile";
    } else if (line.startsWith("efire genkeys")) {
      rl.prompt();
      console.log("Confirm to create and overwrite existing keys [y/n]:");
      lastState = "efire_genkeys";
    } else if (line == "y" && lastState == "efire_genkeys") {
      eFire.genKeys().then(data => {
        if (data == true) {
          lastState = "efire_genkeys_y";
          lastData = {};
          console.log("PUBLIC/PRIVATE KEYS CREATED.");
          init();
          rl.prompt();
        }
      });
    } else if (line == "n") {
      lastState = "";
      lastData = {};
      rl.prompt();
    } else if (line == "exit") {
      console.log("Bye bye!");
      process.exit(0);
    } else {
      rl.prompt();
    }
    /*
    switch (line.trim()) {
      case "efire create user":
        break;
      case "efire create keys":
        break;
      case "efire create chatroom":
        break;
      case "efire connect chatroom":
        break;
      case "efire reconnect chatroom":
        break;
      case "efire clear public":
        break;
      case "sudo efire clear all":
        break;
      case "sudo efire clear oldChat":
        break;
      case "exit()":
        process.exit(0);
        break;
      default:
        break;
    }*/
    readingFromUser = false;
  }
}).on("close", () => {
  console.log("Bye bye!");
  process.exit(0);
});

const popAllUnreadList = () => {
  console.log("pop all called");
  const len = unreadMsgs.length;
  console.log("len:" + len);
  for (var i = 0; i < len; i++) {
    if (i < unreadMsgs.length) {
      console.log(unreadMsgs.shift());
    }
  }
};

/*



const msgEncrypted = keyGen.encryptStringWithRsaPublicKey(
  "dinuka saminda",
  "./keys/publicKey.txt"
);
console.log(msgEncrypted);

const msgDecrepted = keyGen.decryptStringWithRsaPrivateKey(
  msgEncrypted,
  "./keys/prvateKey.txt"
);
console.log(msgDecrepted);
const dataPacket = {
  dataType: "|msg|publicKey|Connected|"
};
//readChatRoomData();
//createNewChatRoom();

//"./public/client_email.txt"
//"./public/email.txt"
//"./public/lastChatRoom.id"



*/
