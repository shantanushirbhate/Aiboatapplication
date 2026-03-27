import React, { useState, useEffect, useRef } from "react";
import boat from "../assets/bot.png";
import edit from "../assets/edit.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  // useMediaQuery,
} from "@mui/material";

export default function SideBar({ messages, setMessages, inputRef }) {
const isMobile = false; // ✅ force sidebar visible for Cypress
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleNewChat = () => {
    setMessages([]);
    navigate("/");

    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);

    setOpen(false);
  };

  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    const loadChats = () => {
      const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
      setChatList(storedChats);
    };

    loadChats(); // initial load

    window.addEventListener("chatUpdated", loadChats);

    return () => {
      window.removeEventListener("chatUpdated", loadChats);
    };
  }, []);

  const handleDeleteChat = (chatId) => {
    const updatedChats = chatList.filter((chat) => chat.id !== chatId);

    setChatList(updatedChats);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));

    // notify other components
    window.dispatchEvent(new Event("chatUpdated"));
  };

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
        component={Link}
        to="/"
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
        component={Link}
        to="/history"
        onClick={() => setOpen(false)}
        sx={{
          backgroundColor: "#D7C7F4",
          textTransform: "none",
        }}
      >
        Past Conversation
      </Button>

      <Box
        sx={{
          mt: 2,
          overflowY: "auto",

          // ✅ Hide scrollbar (Chrome, Safari)
          "&::-webkit-scrollbar": {
            display: "none",
          },

          // ✅ Hide scrollbar (Firefox)
          scrollbarWidth: "none",

          // ✅ Hide scrollbar (IE/Edge legacy)
          msOverflowStyle: "none",
        }}
      >
        {chatList.map((chat, index) => {
          // take first message as preview
          const firstUserMsg = Array.isArray(chat.messages)
            ? chat.messages.find((m) => m.type === "user")
            : null;

          const preview = firstUserMsg?.text?.slice(0, 25) || "New Chat";

          return (
            <Box
              key={chat.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#D7C7F4",
                px: 2,
                py: 1,
                mb: 1,
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#c5b3ec",
                },
              }}
            >
              {/* Chat preview */}
              <Box
                onClick={() => {
                  navigate("/", { state: { selectedChat: chat } });
                  setOpen(false);
                }}
                sx={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {preview}
              </Box>

              {/* ❌ Delete Button */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // 🚨 prevent opening chat
                  handleDeleteChat(chat.id);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
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
