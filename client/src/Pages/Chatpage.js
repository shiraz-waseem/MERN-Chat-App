import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { Box } from "@chakra-ui/layout";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
        style={{ display: "flex" }}
      >
        {user && <MyChats />}
        {user && <Chatbox />}
      </Box>
    </div>
  );
};

export default Chatpage;
