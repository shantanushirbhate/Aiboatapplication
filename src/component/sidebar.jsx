import React, { useState, useEffect,useRef } from "react";
import boat from "../assets/bot.png";
import edit from "../assets/edit.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";

export default function SideBar({ messages, setMessages, inputRef }) {
  const isMobile = useMediaQuery("(max-width:1200px)");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();


const handleNewChat = () => {
  if (messages && messages.length > 0) {
    const oldChats =
      JSON.parse(localStorage.getItem("chatHistory")) || [];

    const newChat = {
      id: Date.now(),
      messages: messages,
    };

    const updatedChats = [...oldChats, newChat];

    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));

    setChatList(updatedChats);
  }

  // ✅ clear chat
  setMessages([]);

  // ✅ navigate to home (IMPORTANT)
  navigate("/");

  // ✅ focus input
  setTimeout(() => {
    inputRef?.current?.focus();
  }, 0);

  // ✅ close sidebar
  setOpen(false);
};

  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatList(storedChats);
  }, []);



  const sidebarContent = (
    <Box
      sx={{
        backgroundColor: "#888491",
        width: "220px",
        height: "calc(93vh - 40px)",
        m: "20px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,

        // Optional: better UI
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {/* Close button (only mobile) */}
      {isMobile && (
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      )}

    <Button
  onClick={handleNewChat}
  sx={{
    backgroundColor: "#D7C7F4",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textTransform: "none",
  }}
>
  <Box component="img" src={boat} sx={{ width: 30, height: 30 }} />

  <Typography sx={{ flexGrow: 1, textAlign: "center" }}>
    New Chat
  </Typography>

  <Box component="img" src={edit} sx={{ width: 30, height: 30 }} />
</Button>

      <Button
        onClick={() => {
          navigate("/history");
          setOpen(false); // close drawer in mobile
        }}
        sx={{
          backgroundColor: "#D7C7F4",
          textTransform: "none",
        }}
      >
        Past Conversation
      </Button>
      <Box sx={{ mt: 2, overflowY: "auto" }}>
  {chatList.map((chat, index) => {
    // take first message as preview
    const preview =
      chat.messages?.[0]?.text?.slice(0, 20) || "New Chat";

    return (
      <Box
        key={chat.id}
        onClick={() => {
          navigate("/", { state: { selectedChat: chat } });
          setOpen(false);
        }}
        sx={{
          backgroundColor: "#D7C7F4",
          px: 2,
          py: 1,
          mb: 1,
          borderRadius: "20px", // ✅ capsule shape
          cursor: "pointer",
          fontSize: "12px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          "&:hover": {
            backgroundColor: "#c5b3ec",
          },
        }}
      >
        {preview}
      </Box>
    );
  })}
</Box>
    </Box>
  );

  return (
    <>
      {/* ✅ Top Navbar (only for mobile/tablet) */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            height: "60px",
            display: "flex",
            alignItems: "center",
            px: 2,
          }}
        >
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {!isMobile && sidebarContent}

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {sidebarContent}
      </Drawer>
    </>
  );
}
