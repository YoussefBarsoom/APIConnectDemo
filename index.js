const express = require('express');

const app = express();
const port = 3000;

function authentication(req, res, next) {
    const authheader = req.headers.authorization;

    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="API Connect"');
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Decode Base64 credentials
    const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    // Validate credentials (Replace with API Connect's user management if needed)
    if (user === 'admin' && pass === 'password') {
        next(); // Allow access
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="API Connect"');
        return res.status(401).json({ error: 'Invalid credentials' });
    }
}

// Middleware to parse JSON requests
app.use(express.json());

// Protected API routes using authentication
app.use(authentication);

app.post('/loan/request', (req, res) => {
    const { customerId, name, email, loanAmount, country, employmentStatus } = req.body;
    res.json({ message: `Loan request received for ${name}` });
});

app.get('/customer/employmentStatus/:customerID', (req, res) => {
    const customerID = req.params.customerID;
    res.json({ customerID, employmentStatus: "Employed" });
});

app.get('/customer/totalbalance/:customerID', (req, res) => {
    const customerID = req.params.customerID;
    res.json({ customerID, totalBalance: "$10,000" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
