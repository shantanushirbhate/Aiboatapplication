import React, { useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Aiimage from "./assets/bot.png";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import SideBar from "./component/sidebar";
import InitialCard from "./component/initialcard";
import ConversationHistory from "./component/conversation";

export default function App() {
  const isMobile = useMediaQuery("(max-width:1200px)");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  return (
    <BrowserRouter>
      <Box
        sx={{
           pr: { xs: "100px", sm: "4px", md: "5px" },
          display: "flex",
          height: "97.5vh", // ✅ full screen
          backgroundColor: "#D7C7F4",
          overflow: "hidden",
          
        }}
      >
        {/* Sidebar */}
        <SideBar
          messages={messages}
          setMessages={setMessages}
          inputRef={inputRef}
        />

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column", // ✅ vertical layout
            p: 2,
            mt: isMobile ? "60px" : 0,
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            BoatAi
          </Typography>

          {/* Center Intro (only when no chat yet) */}
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <Box
                        component="img"
                        src={Aiimage}
                        sx={{
                          height: "60px",
                          width: "60px",
                          borderRadius: "50%",
                        }}
                      />

                      <Typography variant="h5" sx={{ mt:0 }}>
                        How Can I Help You Today?
                      </Typography>
                    </Box>
                  </Box>

                  {/* Chat Section (IMPORTANT) */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <InitialCard />
                  </Box>
                </>
              }
            />
            <Route
              path="/history"
              element={
                <Box sx={{ flex: 1, overflow: "auto" }}>
                  <ConversationHistory />
                </Box>
              }
            />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
