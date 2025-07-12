const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);

const PORT  = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));