function startsWith(message, stringVal) {
  const strLen = stringVal.length;
  const messageSlice = message.substring(0, strLen);

  if (messageSlice === stringVal) {
    return true;
  } else {
    return false;
  }
}

function getURL(message) {
  return message.substring(5);
}

function getVideoID(url) {
  return url.substring(32);
}

module.exports = { startsWith, getURL, getVideoID };
