require('dotenv').config();

const express = require("express");
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
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

app.get('/posts', auth, (req,res) => {
    res.send(posts.filter(post => post.username === req.user.name));
})



function auth(req, res, next) {
    
    const authHeader = req.headers['auth'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = authHeader;
    
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.secret, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.listen(port,()=>{
    console.log(`listening at http://localhost:${port}`);
})