var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
const selfsigned = require("selfsigned");
const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");

const encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
  //var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
  //var publicKey = fs.readFileSync(absolutePath, "utf8");
  var buffer = new Buffer(toEncrypt);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

const decryptStringWithRsaPrivateKey = function(toDecrypt, privateKey) {
  //var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
  //var privateKey = fs.readFileSync(absolutePath, "utf8");
  var buffer = new Buffer(toDecrypt, "base64");
  var decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
};

const genKeys = async () => {
  try {
    var attrs = [{ name: "commonName", value: "contoso.com" }];
    var pems = selfsigned.generate(attrs, {
      keySize: 1024, // the size for the private key in bits (default: 1024)
      days: 30, // how long till expiry of the signed certificate (default: 365)
      algorithm: "sha256", // sign the certificate with specified algorithm (default: 'sha1')
      extensions: [{ name: "basicConstraints", cA: true }], // certificate extensions array
      pkcs7: true, // include PKCS#7 as part of the output (default: false)
      clientCertificate: true // generate client cert signed by the original key (default: false)
    });
    //console.log(Object.keys(pems));

    fs.writeFile("./keys/prvateKey.txt", pems.private, err => {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFile("./keys/publicKey.txt", pems.public, err => {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFile("./keys/cert.txt", pems.cert, err => {
      if (err) {
        console.log(err);
      }
    });
    fs.writeFile("./keys/fingerprint.txt", pems.fingerprint, err => {
      if (err) {
        console.log(err);
      }
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const randomBlock = (count, addTimeStamp) => {
  var str = "";
  for (var i = 0; i < count; i++) {
    var v = Math.random()
      .toString(36)
      .replace("0.", "");
    v = v.split("");
    v = v.map(v => {
      return Math.random() > 0.5 ? v.toUpperCase() : v;
    });

    str += v.join("");
  }
  return str + "" + (addTimeStamp ? Date.now() : "");
};

const createNewChatRoom = (idpath, saveFilePath, myUUID) => {
  try {
    const chatID = uuidv1() + "_" + randomBlock(3, false);
    fs.writeFile(idpath, chatID, err => {
      if (err) {
        console.log(err);
      }
    });
    const pubKey = fs.readFileSync("./keys/publicKey.txt", {
      encoding: "utf8"
    });
    var publickeyData = {
      CHAT_ROOM_ID: chatID,
      myUUID: myUUID,
      PUBLICK_KEY: pubKey
    };
    fs.writeFile(saveFilePath, JSON.stringify(publickeyData), err => {
      if (err) {
        console.log(err);
      }
    });
    console.log("New Chat Room ID:\n" + chatID);
    return chatID;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const findText = (
  body,
  startStr,
  endStr,
  startExpLmit = -1,
  startBegin = 0,
  startShift = 0,
  endShift = 0
) => {
  var startIdx =
    body.indexOf(startStr, startBegin) + startStr.length + startShift;

  var endIdx = body.indexOf(endStr, startIdx + 1) + endShift;
  if (endIdx > startIdx && startIdx > startExpLmit) {
    return body.substring(startIdx, endIdx);
  } else {
    return "";
  }
};
const fileToJson = filePath => {
  try {
    var data = fs.readFileSync(filePath, {
      encoding: "utf8"
    });
    data = JSON.parse(data);
    return data;
  } catch (err) {
    return null;
  }
};
const fileToStr = filePath => {
  try {
    var data = fs.readFileSync(filePath, {
      encoding: "utf8"
    });
    return data;
  } catch (err) {
    return null;
  }
};

const jsonToFile = (jsonObj, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(jsonObj), {
      encoding: "utf8"
    });
    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const createScreComProfile = (name, filepath) => {
  const data = {
    id: randomBlock(2),
    name: name
  };
  jsonToFile(data, filepath);
  return data;
};
module.exports = {
  findText: findText,
  encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
  decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey,
  genKeys: genKeys,
  createNewChatRoom: createNewChatRoom,
  createScreComProfile: createScreComProfile,
  fileToJson: fileToJson,
  fileToStr: fileToStr,
  jsonToFile: jsonToFile
};
