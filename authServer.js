require('dotenv').config();

const express = require("express");
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;
app.use(express.json());


const posts = [
    {
        username: 'ravi',
        post: 'Post 1'
    },
    {
        username: 'yogi',
        post: 'Post 1'
    }
]

// app.get('/posts', auth, (req,res) => {
//     res.send(posts.filter(post => post.username === req.user.name));
// })

let refreshTokens = [];

app.post('/token', (req,res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.secret, (err, user) => {
        if(err) return sendStatus(403);
        const accessToken = generateAccessToken({name: user.name});
        res.json({accessToken: accessToken});
    })
})

app.delete('/logout', (req,res) => {
    refreshTokens = refreshTokens.filter( token => token !== req.body.token)
    res.sendStatus(204);
})


app.post('/login', (req,res) => {
    //Authenticate user

    const username = req.body.username;
    const user = {name: username};
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.secret);
    refreshTokens.push(refreshToken);

    res.json({accessToken: accessToken, refreshToken: refreshToken });
})

function generateAccessToken( user ) {

    return jwt.sign(user, process.env.secret, { expiresIn: '15s'});
}

app.listen(port,()=>{
    console.log(`listening at http://localhost:${port}`);
})