require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const asyncRetry = require('async-retry');

const app = express();

// Nepal-specific configuration
process.env.TZ = 'Asia/Kathmandu';

// CORS for .com.np domains
const allowedOrigins = [
  'https://www.yourdomain.com.np',
  'https://yourdomain.com.np',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Email transporter with Nepal-optimized settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  connectionTimeout: 10000 // Increased timeout for Nepal
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await asyncRetry(async () => {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: 'aadarshasangraula@gmail.com',
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<div>...Nepal-styled HTML email...</div>`
      });
    }, {
      retries: 3,
      minTimeout: 2000
    });

    res.status(200).json({ 
      success: true,
      message: 'धन्यवाद! तपाईंको सन्देश पठाइएको छ।'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'माफ गर्नुहोस्, सन्देश पठाउन असफल भयो।'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
