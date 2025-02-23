import React from "react";
import { Box, Typography, Card, Stack, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import FormatAlignLeftOutlined from "@mui/icons-material/FormatAlignLeftOutlined";
import ChatRounded from "@mui/icons-material/ChatRounded";
import Javascript from "@mui/icons-material/JavascriptOutlined";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1
      }}>
        <Box p={2}>
          <Typography variant="h4" mb={2} fontWeight="bold">
            Text Generation
          </Typography>
          <Card
            onClick={() => navigate("/summary")}
            sx={{
              boxShadow: 2,
              borderRadius: 5,
              height: 190,
              width: 200,
              "&:hover": {
                border: 2,
                boxShadow: 0,
                borderColor: "primary.dark",
                cursor: "pointer",
              },
            }}
          >
            <DescriptionRounded
              sx={{ fontSize: 80, color: "primary.main", mt: 2, ml: 2 }}
            />
            <Stack p={3} pt={0}>
              <Typography fontWeight="bold" variant="h5">
                TEXT SUMAMRY
              </Typography>
              <Typography variant="h6">
                Summarize long text into short sentences
              </Typography>
            </Stack>
          </Card>
        </Box>
        <Box p={2}>
          <Typography variant="h4" mb={2} fontWeight="bold">
            Parapgraph Generation
          </Typography>
          <Card
            onClick={() => navigate("/paragraph")}
            sx={{
              boxShadow: 2,
              borderRadius: 5,
              height: 190,
              width: 200,
              "&:hover": {
                border: 2,
                boxShadow: 0,
                borderColor: "primary.dark",
                cursor: "pointer",
              },
            }}
          >
            <FormatAlignLeftOutlined
              sx={{ fontSize: 80, color: "primary.main", mt: 2, ml: 2 }}
            />
            <Stack p={3} pt={0}>
              <Typography fontWeight="bold" variant="h5">
                Parapgraph
              </Typography>
              <Typography variant="h6">
                Generate Paragraph with words
              </Typography>
            </Stack>
          </Card>
        </Box>
        <Box p={2}>
          <Typography variant="h4" mb={2} fontWeight="bold">
            AI ChatBot
          </Typography>
          <Card
            onClick={() => navigate("/chatbot")}
            sx={{
              boxShadow: 2,
              borderRadius: 5,
              height: 190,
              width: 200,
              "&:hover": {
                border: 2,
                boxShadow: 0,
                borderColor: "primary.dark",
                cursor: "pointer",
              },
            }}
          >
            <ChatRounded
              sx={{ fontSize: 80, color: "primary.main", mt: 2, ml: 2 }}
            />
            <Stack p={3} pt={0}>
              <Typography fontWeight="bold" variant="h5">
                Chatbot
              </Typography>
              <Typography variant="h6">Chat With AI Chatbot</Typography>
            </Stack>
          </Card>
        </Box>
        <Box p={2}>
          <Typography variant="h4" mb={2} fontWeight="bold">
            Javascript Converter
          </Typography>
          <Card
            onClick={() => navigate("/js-converter")}
            sx={{
              boxShadow: 2,
              borderRadius: 5,
              height: 190,
              width: 200,
              "&:hover": {
                border: 2,
                boxShadow: 0,
                borderColor: "primary.dark",
                cursor: "pointer",
              },
            }}
          >
            <Javascript
              sx={{ fontSize: 80, color: "primary.main", mt: 2, ml: 2 }}
            />
            <Stack p={3} pt={0}>
              <Typography fontWeight="bold" variant="h5">
                JS CONVERTER
              </Typography>
              <Typography variant="h6">
                Trasnlate english to javascript code
              </Typography>
            </Stack>
          </Card>
        </Box>
        <Box p={2}>
          <Typography variant="h4" mb={2} fontWeight="bold">
            Image Solution
          </Typography>
          <Card
            onClick={() => navigate("/ImageToText")}
            sx={{
              boxShadow: 2,
              borderRadius: 5,
              height: 190,
              width: 200,
              "&:hover": {
                border: 2,
                boxShadow: 0,
                borderColor: "primary.dark",
                cursor: "pointer",
              },
            }}
          >
            <RocketLaunchIcon 
              sx={{ fontSize: 80, color: "primary.main", mt: 2, ml: 2 }}
            />
            <Stack p={3} pt={0}>
              <Typography fontWeight="bold" variant="h5">
                Select Image
              </Typography>
              <Typography variant="h6">Generate Solution</Typography>
            </Stack>
          </Card>
        </Box>
      </Box>

      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
          left: 0,
          backgroundColor: (theme) => theme.palette.background.paper,
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Contact Us
        </Typography>
        <Stack 
          spacing={2} 
          alignItems="center"
          sx={{ maxWidth: '600px', mx: 'auto' }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon color="primary" />
            <Link href="mailto:kmdraza47@gmail.com" underline="hover">
              kmdraza47@gmail.com
            </Link>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <PhoneIcon color="primary" />
            <Typography>+91 1234567890</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <LinkedInIcon color="primary" />
            <Link 
              href="https://portfolio-mdraza.vercel.app/" 
              target="_blank" 
              underline="hover"
            >
            Profile
            </Link>
          </Box>
        </Stack>
      </Box>
      
      {/* Add margin bottom to prevent content from being hidden behind fixed footer */}
      <Box sx={{ mb: 20 }} />
    </Box>
  );
};

export default Homepage;