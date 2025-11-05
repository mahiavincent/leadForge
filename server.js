const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.get('/', (req, res) => {
    res.send(`
    <h2>Send Email via Gmail (App Password)</h2>
    <form action="/send" method="post">
      <input name="to" type="email" placeholder="Recipient" required /><br>
      <input name="subject" type="text" placeholder="Subject" required /><br>
      <textarea name="message" placeholder="Message" required></textarea><br>
      <button type="submit">Send</button>
    </form>
  `);
});

app.post('/send', async (req, res) => {
    const { to, subject, message } = req.body;

    try {
        const info = await transporter.sendMail({
            from: `"LeadForge" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: message,
        });

        res.send(`<p>Email sent successfully!</p><pre>${info.response}</pre>`);
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).send(`<p>Error sending email: ${err.message}</p>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));