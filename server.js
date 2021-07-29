const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'Johm',
            email: 'john@gmail.com',
            password: 'secret',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'borracha',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.listen(3000, () => {
    console.log('app is running on port 3000')
})


app.get('/', (req,res)=> {
    res.json(database)
})

app.post('/signin', (req, res) => {
    console.log(req.body.email)
    console.log(req.body.password)
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash)
    });
    database.users.push(
        {
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length -1])
})

app.get('/profile/:id', (req, res)=>{
    const {id} = req.params
    database.users.forEach(user => {
        if (user.id === id){
            return res.json(user)
        }
    })
    return res.status(404).json('no such user !')
})


app.put('/image', (req,res)=> {
    const {id} = req.body
    database.users.forEach(user => {
        if (user.id === id){
            user.entries++
            return res.json(user.entries)
        }
    })
    return res.status(404).json('no such user !')
})




/* // Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
}); */