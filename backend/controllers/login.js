const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const loginRouter = require('express').Router();

loginRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = await User.findOne({ username: body.username });

    const passwordFound = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

    if (!(user && passwordFound)) {
        return res.json({ error: 'Invalid user credentials' }).status(401);
    }

    const userCredentials = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userCredentials, process.env.SECRET);


    response.json({
        username: user.username,
        name: user.name,
        token
    })
})

module.exports = loginRouter;