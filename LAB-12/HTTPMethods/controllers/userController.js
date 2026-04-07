let users = [
    { id: 1, name: 'Veera', email: 'veera@example.com' },
    { id: 2, name: 'Naveen', email: 'naveen@example.com' }
];

// GET all users
exports.getAllUsers = (req, res) => {
    res.json(users);
};

// GET single user by ID
exports.getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
};

// POST create new user
exports.createUser = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json({
        message: 'User created successfully',
        user: newUser
    });
};

// PUT update user
exports.updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    res.json({
        message: 'User updated successfully',
        user
    });
};

// DELETE user
exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        message: 'User deleted successfully',
        user: deletedUser[0]
    });
};