import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  CardContent,
  Button,
  TextField,
  Box,
} from "@mui/material";
import AiData from "../aiData/sampledata.json";
import userImage from "../assets/person.png";
import boatImage from "../assets/bot.png";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

import { useLocation } from "react-router-dom";

import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useTheme, useMediaQuery } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function InitialCard() {
  const inputRef = useRef(null);

  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const [ratings, setRatings] = useState({});
  const [reactions, setReactions] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // storing in localstorage //
  const [feedbacks, setFeedbacks] = useState({});

  const handleReaction = (index, type) => {
    setReactions((prev) => ({
      ...prev,
      [index]: type,
    }));

    if (type === "dislike") {
      setSelectedMsgIndex(index);
      setOpenFeedback(true);
    }
  };

  const handleSaveChat = () => {
    if (messages.length === 0) return;
    const chatData = {
      id: Date.now() + Math.random(),
      messages,
      ratings,
      feedbacks,
      createdAt: new Date().toISOString(),
    };

    // get existing chats
    const existingChats = JSON.parse(localStorage.getItem("chatHistory")) || [];

    // add new chat
    const updatedChats = [...existingChats, chatData];

    // save back
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));

    window.dispatchEvent(new Event("chatUpdated"));

    setOpenSnackbar(true);
  };

  const handleRatingChange = (index, value) => {
    setRatings((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  useEffect(() => {
    // small timeout ensures DOM is ready
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [location]);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [messages]);

 const handleCardClick = (question) => {
  const normalizedInput = question.toLowerCase().trim();

  const found = AiData.find((item) => {
    const normalizedQuestion = item.question.toLowerCase().trim();

    return (
      normalizedInput.includes(normalizedQuestion) ||
      normalizedQuestion.includes(normalizedInput)
    );
  });

  const botReply = found
    ? found.response
    : "Sorry, Did not understand your query!";

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  setMessages((prev) => [
    ...prev,
    { type: "user", text: question, time: getTime() },
    { type: "bot", text: botReply, time: getTime() },
  ]);
};
  useEffect(() => {
    if (location.state?.selectedChat) {
      setMessages(location.state.selectedChat.messages);
    }
    window.history.replaceState({}, document.title);
  }, [location.state]);

  const handleSend = () => {
    if (!input.trim()) return;
    handleCardClick(input);
    setInput("");
  };

  return (
    <>
      <Box
        Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          width: "100%",
          maxWidth: "900px",
          mx: "auto", // ✅ perfect center (NO LEFT SPACE ISSUE)
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flex: 1, // ✅ IMPORTANT (takes remaining space)
            overflowY: "auto",
            mb: 2,

            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "300px", sm: "0", md: "100%" },
                display: "flex",
                flexDirection: msg.type === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: 1.5,
                mb: 2,
              }}
            >
              {/* Avatar */}
              <Box
                component="img"
                src={msg.type === "user" ? userImage : boatImage}
                sx={{
                  height: { xs: "28px", sm: "34px", md: "40px" },
                  width: { xs: "28px", sm: "34px", md: "40px" },
                  borderRadius: "50%",
                }}
              />

              {/* Message Card */}
              <Box
                onClick={() => {
                  if (isMobile) {
                    setActiveIndex(activeIndex === index ? null : index);
                  }
                }}
                onMouseEnter={() => {
                  if (!isMobile) setHoveredIndex(index);
                }}
                onMouseLeave={() => {
                  if (!isMobile) setHoveredIndex(null);
                }}
                sx={{
                  backgroundColor: msg.type === "user" ? "#e6e6e6" : "#fff",
                  p: 1.5,
                  pb: msg.type === "bot" ? 6 : 1.5,
                  borderRadius: "12px",
                  maxWidth: {
                    xs: "85%", // mobile
                    sm: "75%", // tablet
                    md: "65%", // desktop
                  },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  position: "relative",

                  "&:hover .reaction-icons": {
                    opacity: 1,
                  },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {msg.type === "user" ? (
                      "You"
                    ) : (
                      <Box component="span" sx={{ color: "#1976d2" }}>
                        Soul AI
                      </Box>
                    )}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {msg.time}
                  </Typography>
                </Box>

                {/* Message Text */}
{msg.type === "bot" ? (
  <Box
    component="p"
    sx={{
      margin: 0,
      fontSize: "14px",
      lineHeight: 1.5,
      color: "#333",
    }}
  >
    {msg.text}
  </Box>
) : (
  <Typography variant="body2">{msg.text}</Typography>
)}                {msg.type === "bot" &&
                  reactions[index] === "like" &&
                  ((isMobile && activeIndex === index) ||
                    (!isMobile && hoveredIndex === index)) && (
                    <Box sx={{ mt: 1 }}>
                      <Rating
                        name={`rating-${index}`}
                        value={ratings[index] || 0}
                        onChange={(e, newValue) =>
                          handleRatingChange(index, newValue)
                        }
                      />
                    </Box>
                  )}
                {msg.type === "bot" && (
                  <Box
                    className="reaction-icons"
                    sx={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      display: "flex",
                      gap: 1,
                      opacity:
                        (isMobile && activeIndex === index) ||
                        (!isMobile && hoveredIndex === index)
                          ? 1
                          : 0,
                      transition: "0.3s",
                    }}
                  >
                    {/* 👍 Like */}
                    <Button
                      onClick={() => handleReaction(index, "like")}
                      sx={{
                        minWidth: "30px",
                        color: reactions[index] === "like" ? "#1976d2" : "#777",
                      }}
                    >
                      {reactions[index] === "like" ? (
                        <ThumbUpAltIcon />
                      ) : (
                        <ThumbUpAltOutlinedIcon />
                      )}
                    </Button>

                    {/* 👎 Dislike */}
                    <Button
                      onClick={() => handleReaction(index, "dislike")}
                      sx={{
                        minWidth: "30px",
                        color:
                          reactions[index] === "dislike" ? "#d32f2f" : "#777",
                      }}
                    >
                      {reactions[index] === "dislike" ? (
                        <ThumbDownAltIcon />
                      ) : (
                        <ThumbDownAltOutlinedIcon />
                      )}
                    </Button>
                  </Box>
                )}
                {msg.type === "bot" &&
                  feedbacks[index] &&
                  ((isMobile && activeIndex === index) ||
                    (!isMobile && hoveredIndex === index)) && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        backgroundColor: "#f5f5f5",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      <strong>Feedback:</strong> {feedbacks[index]}
                    </Box>
                  )}
              </Box>
            </Box>
          ))}
          <div ref={bottomRef} />
        </Box>

        {messages.length === 0 && (
          <>
            {/* Row 1 */}
            <Box
              sx={{
                width: { xs: "300px", sm: "100%", md: "100%" },
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr", // mobile
                  sm: "1fr 1fr", // tablet+
                },
                gap: 2,
              }}
            >
              {" "}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Card
                  sx={cardStyle}
                  onClick={() => handleCardClick("Hi, what is the weather?")}
                >
                  <CardContent>
                    <Typography variant="h6">
                      Hi, what is the weather
                    </Typography>
                    <Typography variant="body2">
                      Get immediate AI generated response
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={cardStyle}
                  onClick={() => handleCardClick("Hi, what is my location")}
                >
                  <CardContent>
                    <Typography variant="h6">
                      Hi, what is my location
                    </Typography>
                    <Typography variant="body2">
                      Get immediate AI generated response
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              {/* Row 2 */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Card
                  sx={cardStyle}
                  onClick={() => handleCardClick("Hi, what is the temperature")}
                >
                  <CardContent>
                    <Typography variant="h6">
                      Hi, what is the temperature
                    </Typography>
                    <Typography variant="body2">
                      Get immediate AI generated response
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={cardStyle}
                  onClick={() => handleCardClick("Hi, how are you")}
                >
                  <CardContent>
                    <Typography variant="h6">Hi, how are you</Typography>
                    <Typography variant="body2">
                      Get immediate AI generated response
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </>
        )}

        {/* ✅ INPUT SECTION (ALWAYS VISIBLE) */}
      <Box
  component="form"
  onSubmit={(e) => {
    e.preventDefault();
    handleSend();
  }}
  sx={{
    width:{xs:"300px", sm:"100%" , md:"100%"},
    display: "flex",
    gap: 1,
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    flexShrink: 0,
  }}
>
  <TextField
    fullWidth
    inputRef={inputRef}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Message Bot AI..."
    sx={{
      backgroundColor: "#fff",
      borderRadius: "12px",
    }}
  />

  <Button type="submit" variant="contained">
    Ask
  </Button>

  <Button variant="outlined" type="button" onClick={handleSaveChat}>
    Save
  </Button>
</Box>
      </Box>
      <Dialog
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
        fullWidth
        maxWidth="sm"
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Provide additional feedback
          <IconButton onClick={() => setOpenFeedback(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your feedback..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>

        {/* Actions */}
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setFeedbacks((prev) => ({
                ...prev,
                [selectedMsgIndex]: feedbackText,
              }));

              setFeedbackText("");
              setOpenFeedback(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity="success"
          onClose={() => setOpenSnackbar(false)}
        >
          Chat saved successfully ✅
        </MuiAlert>
      </Snackbar>
    </>
  );
}

// ✅ Card Style
const cardStyle = {
  flex: "1 1 300px",
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
};
