import React, { useEffect, useRef } from "react";
import { Box, Typography, Card, Stack, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DescriptionRounded,
  FormatAlignLeftOutlined,
  ChatRounded,
  JavascriptOutlined as Javascript,
  RocketLaunch as RocketLaunchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,

} from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';

const cardStyle = {
  background: 'rgba(13, 17, 23, 0.85)',
  backdropFilter: 'blur(12px)',
  borderRadius: '20px',
  border: '1px solid rgba(88, 88, 255, 0.2)',
  padding: '32px',
  minHeight: '340px',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(88, 88, 255, 0.1), rgba(255, 88, 255, 0.1), transparent)',
    transition: 'all 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    border: '1px solid rgba(88, 88, 255, 0.5)',
    boxShadow: `
      0 0 20px rgba(88, 88, 255, 0.2),
      inset 0 0 20px rgba(88, 88, 255, 0.1)
    `,
    '&::before': {
      left: '100%',
    },
    '& .card-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      filter: 'drop-shadow(0 0 8px rgba(88, 88, 255, 0.5))',
    },
    '& .card-title': {
      background: 'linear-gradient(90deg, #ff1cf7, #00fff0)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    }
  }
};

const cards = [
  {
    title: "Text Generation",
    path: "/summary",
    icon: <DescriptionRounded sx={{ 
      fontSize: 80,
      color: '#00fff0',
      filter: 'drop-shadow(0 0 5px rgba(0, 255, 240, 0.5))',
      transition: 'all 0.3s ease',
    }} className="card-icon" />,
    description: "Summarize long text into short sentences"
  },
  {
    title: "Paragraph Generation",
    path: "/paragraph",
    icon: <FormatAlignLeftOutlined sx={{ 
      fontSize: 80,
      color: '#c300ff',
      filter: 'drop-shadow(0 0 5px rgba(176, 129, 196, 0.43))',
      transition: 'all 0.3s ease',
    }} className="card-icon" />,
    description: "Generate Paragraph with words"
  },
  {
    title: "AI ChatBot",
    path: "/chatbot",
    icon: <ChatRounded sx={{ 
      fontSize: 80,
      color: '#00aaff',
      filter: 'drop-shadow(0 0 10px rgba(0, 170, 255, 0.8))',
      transition: 'all 0.3s ease',
    }} className="card-icon" />,
    description: "Chat With AI Chatbot"
  },
  {
    title: "Javascript Converter",
    path: "/js-converter",
    icon: <Javascript sx={{ 
      fontSize: 80,
      color: '#00ff40',
      filter: 'drop-shadow(0 0 10px rgba(0, 255, 64, 0.8))',
      transition: 'all 0.3s ease',
    }} className="card-icon" />,
    description: "Translate english to javascript code"
  },
  {
    title: "Image Solution",
    path: "/ImageToText",
    icon: <RocketLaunchIcon sx={{ 
      fontSize: 80,
      color: '#ff9100', // Vibrant orange for energy & creativity
      filter: 'drop-shadow(0 0 10px rgba(255, 145, 0, 0.8))', // Soft orange glow
      transition: 'all 0.3s ease',
    }} className="card-icon" />,   
    description: "Generate Solution"
  },
  {
    title: "Python Code Generator",
    path: "/py-converter",
    icon: <FontAwesomeIcon 
      icon={faPython} 
      style={{ 
        fontSize: 80,
        color: '#4B8BBE', // Python's official blue color
        filter: 'drop-shadow(0 0 5px rgba(143, 183, 215, 0.61))',
        transition: 'all 0.3s ease',
      }} 
      className="card-icon"
    />,
    description: "Convert English instructions into Python code"
  }
];

const Homepage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#06B6D4'];
      return Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    };

    setupCanvas();
    const particles = createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        // Update particle position
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'black', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {cards.map((card, index) => (
            <Box key={index} p={2} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <Typography variant="h4" mb={2} fontWeight="bold" color="white">
                {card.title}
              </Typography>
              <Card onClick={() => navigate(card.path)} sx={cardStyle}>
                {card.icon}
                <Stack p={3} pt={0}>
                  <Typography fontWeight="bold" variant="h5" color="white" className="card-title">
                    {card.title}
                  </Typography>
                  <Typography variant="h6" color="white">
                    {card.description}
                  </Typography>
                </Stack>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ 
        position: 'relative', 
        bottom: 0,
        width: '100%',
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(0, 0, 0, 0.86)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        p: 2,
        textAlign: 'center',
        zIndex: 2
      }}>
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
            <Typography color="red">+91 1234567890</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Link 
              href="https://portfolio-mdraza.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'linear-gradient(45deg, #4ecdc4, #ff6b6b)',
                padding: '0.5rem 1rem',
                borderRadius: '25px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 15px rgb(255, 250, 250)',
                }
              }}
            >
              👉 Profile ▶️
              <FontAwesomeIcon 
                icon={faGlobe} 
                style={{ 
                  marginLeft: '0.5rem',
                  animation: 'rotate 3s linear infinite'
                }} 
              />
            </Link>
          </Box>
        </Stack>
      </Box>

      

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes neonPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(88, 88, 255, 0.5); }
          50% { border-color: rgba(255, 88, 255, 0.5); }
        }
        .card-icon {
          animation: neonPulse 2s infinite;
        }
      `}</style>
    </Box>
  );
};

export default Homepage;
