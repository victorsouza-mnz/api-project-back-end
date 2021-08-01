const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : '123',
        database : 'apidb'
    }
});


const app = express()
app.use(express.json())
app.use(cors())



app.listen(3000, () => {
    console.log('app is running on port 3000')
})



app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login').where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid) {
                return db.select('*').from('users').where('email', '=', req.body.email)
                        .then(user => {
                            res.json(user[0])
                        })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body
    const hash = bcrypt.hashSync(password)

    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email,
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined : new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })

    .catch(err => res.status(400).json('duplicate name or email'))
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
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get count'))
})




/* // Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
}); */