const express = require('express');
const exhibitionsRoutes = require('./routes/exhibitions');
const maldivesRoutes = require('./routes/maldives');
const cors = require('cors');

const app = express();
const PORT = 3001;
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/exhibitions', exhibitionsRoutes);

// Routes - not possible, as cannot run in headless mode, due to detecting bot activity
//app.use('/api/maldives', maldivesRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
