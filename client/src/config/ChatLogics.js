export const getSender = (loggedUser, users) => {
  // in users array it will leave the user that is not logged in. baqi users ko it will take
  // 2 hi users hugy since groupchat nahi ha
  // in users array user of 0 is logged in user hai tw yeh return wrna ye return
  // users array mein phely ham ha
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};
