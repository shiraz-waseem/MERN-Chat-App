import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, user, setSelectedChat } = ChatState();

  return (
    <Box
      // base choti screen baqi md and ussy bari mein flex
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }} // in base screen if chat is selected in and medium screen mein always flex
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        user={user}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
};

export default Chatbox;
