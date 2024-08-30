import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import {
  Avatar,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Toast,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  getSender,
  getSenderFull,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableFeed from "react-scrollable-feed";

import "./styles.css";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]); // fetch all backend messages
  const [newMessage, setNewMessage] = useState(""); // storing to send
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false); // dosra banda

  const [loading, setLoading] = useState(false);
  const { selectedChat, user, setSelectedChat } = ChatState();
  const toast = useToast();

  // console.log("Selected chat", selectedChat);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Data for fetching all messages is: ", data);

      setMessages(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Internet Connection Problem!",
        description: "Failed to fetch the message",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      // alert(newMessage);

      setNewMessage(""); // wont affect api call since the function is asynchronous
      try {
        const response = await fetch(`http://localhost:8000/api/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat,
          }),
        });
        const data = await response.json();
        console.log(data);

        // Whatever we are getting we are going to append it to array of all messages
        // As the chat has some messages and when we send some messages the all messages array must append it

        setMessages([...messages, data]); // jo messages wo and add data
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          {/* Aik back icon for mobile screens */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {/* Text. Display the person jissy baat krrhy uska naam or agar groupChat tw GroupChat Name*/}
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
                {/* // {Add remove members} */}
              </>
            )}
          </Text>

          {/* Messages send and get */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              // messages here
              <div className="messages">
                <ScrollableFeed>
                  {messages &&
                    messages.map((m, i) => (
                      <div style={{ display: "flex" }} key={m._id}>
                        {/* left side we have picture, right side we dont have. Profile picture at bottom of the message 3 ha tw third py */}
                        {/* any of these true */}
                        {(isSameSender(messages, m, i, user._id) ||
                          isLastMessage(messages, i, user._id)) && (
                          <Tooltip
                            label={m?.sender?.name}
                            placement="bottom-start"
                            hasArrow
                          >
                            <Avatar
                              mt="7px"
                              mr={1}
                              size="sm"
                              cursor="pointer"
                              name={m?.sender?.name}
                              src={m?.sender?.pic}
                            />
                          </Tooltip>
                        )}
                        <span
                          style={{
                            backgroundColor: `${
                              m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                            marginLeft: isSameSenderMargin(
                              messages,
                              m,
                              i,
                              user._id
                            ),
                            marginTop: isSameUser(messages, m, i, user._id)
                              ? 3 // lagataar same message arhy tw 3 tk margin wrna 10 tk
                              : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                          }}
                        >
                          {" "}
                          {m.content}
                        </span>
                      </div>
                    ))}
                </ScrollableFeed>
              </div>
            )}

            {/* Input tag */}
            <FormControl
              onKeyDown={sendMessage} // enter
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? <div>Someone is Typing...</div> : <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage} // Control input tag
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
