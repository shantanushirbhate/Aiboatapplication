import React, { useEffect, useState } from "react";
import { Box, Card, Typography,Button } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

import userImage from "../assets/person.png";
import boatImage from "../assets/bot.png";

export default function ConversationHistory() {
  const [chats, setChats] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChats(storedChats);
  }, []);
  const processedChats = chats
    // ✅ FILTER
    .filter((chat) => {
      if (!selectedRating) return true;

      return Object.values(chat.ratings || {}).some(
        (rating) => rating === selectedRating,
      );
    })

    // ✅ SORT (highest rating first)
    .sort((a, b) => {
      const maxA = Math.max(...Object.values(a.ratings || { 0: 0 }));
      const maxB = Math.max(...Object.values(b.ratings || { 0: 0 }));

      return maxB - maxA;
    });
  
  const groupChatsByDate = (chats) => {
  const groups = {};

  chats.forEach((chat) => {
    const date = new Date(chat.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let label = date.toDateString();

    if (date.toDateString() === today.toDateString()) {
      label = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "Yesterday";
    }

    if (!groups[label]) {
      groups[label] = [];
    }

    groups[label].push(chat);
  });

  return groups;
  };
  const groupedChats = groupChatsByDate(processedChats);

  return (
    <Box  sx={{
    p: 3,
    height: "100vh",        // ✅ full height
    overflowY: "hidden",      // ✅ enable scroll

    // ✅ Hide scrollbar (Chrome, Safari)
    "&::-webkit-scrollbar": {
      display: "none",
    },

    // ✅ Firefox
    scrollbarWidth: "none",

    // ✅ IE/Edge legacy
    msOverflowStyle: "none",
  }}>
      {processedChats.length === 0 && <Typography>No chats found</Typography>}
      <Typography>
        Showing chats with: {selectedRating || "All Ratings"}
      </Typography>

      <Button onClick={() => setSelectedRating("")}>Clear Filter</Button>

      {chats.length === 0 && <Typography>No chats found</Typography>}
      <Box sx={{ mb: 2 }}>
        <Select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          displayEmpty
          sx={{ backgroundColor: "#fff", minWidth: 200 }}
        >
          <MenuItem value="">All Ratings</MenuItem>
          <MenuItem value={5}>5 ⭐</MenuItem>
          <MenuItem value={4}>4 ⭐</MenuItem>
          <MenuItem value={3}>3 ⭐</MenuItem>
          <MenuItem value={2}>2 ⭐</MenuItem>
          <MenuItem value={1}>1 ⭐</MenuItem>
        </Select>
      </Box>

    {Object.keys(groupedChats).map((date) => (
  <Box key={date} sx={{ mb: 3 }}>
    
    {/* 📅 Date Heading */}
    <Typography
      variant="h6"
      sx={{ mb: 1, fontWeight: "bold", color: "#555" }}
    >
      {date}
    </Typography>

    {/* Chats under this date */}
    {groupedChats[date].map((chat) => (
      <Card
        key={chat.id}
        sx={{
          mb: 2,
          p: 2,
          borderRadius: "12px",
          boxShadow: 3,
        }}
      >
        {chat.messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              mb: 2,
            }}
          >
            {/* Avatar */}
            <Box
              component="img"
              src={msg.type === "user" ? userImage : boatImage}
              sx={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
              }}
            />

            {/* Message */}
            <Box
              sx={{
                backgroundColor:
                  msg.type === "user" ? "#E3F2FD" : "#F1F1F1",
                p: 1.5,
                borderRadius: "10px",
                maxWidth: "70%",
              }}
            >
              {/* Name + Time */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {msg.type === "user" ? "You" : "Soul AI"}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {msg.time}
                </Typography>
              </Box>

              <Typography variant="body2">{msg.text}</Typography>

              {/* Feedback + Rating */}
              {msg.type === "bot" && (
                <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                  {chat.feedbacks?.[index] && (
                    <Typography variant="caption">
                      Feedback: {chat.feedbacks[index]}
                    </Typography>
                  )}

                  {chat.ratings?.[index] && (
                    <Typography variant="caption">
                      Rating: {"⭐".repeat(chat.ratings[index])}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Card>
    ))}
  </Box>
))}
    </Box>
  );
}
