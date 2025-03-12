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

app.post('/loan/request', (req, res) => {
    const { customerId, name, email, loanAmount, country, employmentStatus } = req.body;
    res.json({
        "version": "v1",
        customerId,
        "eligibility": "Approved",
        "maxLoanAmount": 30000,
        "interestRate": "5.5%",
        "message": "You are eligible for a loan up to $30,000 at a 5.5% interest rate."
      });
});

app.get('/customer/employmentStatus/:customerID', (req, res) => {
    const customerID = req.params.customerID;
    res.json({ customerID, employmentStatus: "Employed" });
});

app.get('/customer/totalbalance/:customerID', (req, res) => {
    const customerID = req.params.customerID;
    res.json({ customerID, totalBalance: "$10,000" });
});

app.get('/authorize', (req, res) => {
    const authheader = req.headers.authorization;

    if (!authheader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="API Connect"');
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        const pass = auth[1];

        if (user === 'admin' && pass === 'password') {
            return res.json({ message: 'Authentication successful', authorized: true });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'Invalid authentication format' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
