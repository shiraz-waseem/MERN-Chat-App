export const getSender = (loggedUser, users) => {
  // in users array it will leave the user that is not logged in. baqi users ko it will take
  // 2 hi users hugy since groupchat nahi ha
  // in users array user of 0 is logged in user hai tw yeh return wrna ye return
  // users array mein phely ham ha
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

// isSameSender
// It will take the all messages, the current message the current index of message the logged in user
// opposite user dosra banda only then profile picture
// It will check if its length then all the messages only then proceed. Aik hi index and aik hi length no need to proceed
// if the next message is not same as the same sender (same user) ya undefined
// userId ke equal nahi means its from the other user
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// isLastMessage
// taking almost the same things
// if its the last message of the opposite user or not? Very last..  last huna chae tw tripe === lagaya
// and the id of the last message array is not equal to the curent logged in userId and that message actually exist then we return true otherwise false
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id // exists
  );
};

// is SameSenderMargin logic
// It will check if its the same user isSameSender jaisi logic
// return 33 margin
// otherwise return 0 margin
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

// if index is more than 0 and previous message ki id and sender ki next is same it returns true
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
