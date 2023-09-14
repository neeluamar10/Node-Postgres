const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port:5432
})


/*
GET: / | displayHome()
GET: /users | getUsers()
GET: /users/:id | getUserById()
POST: /users | createUser()
PUT: /users/:id | updateUser()
DELETE: /users/:id | deleteUser()
*/

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error,results) => {
        if(error)
        {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const {name, email} = request.body;
    pool.query('INSERT INTO users(name,email) VALUES ($1, $2) RETURNING *', [name, email], (error,results) => {
        if(error){
            throw error
        } 
        response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
}

const updateUser = (request, response) => {
    const id = request.params.id;
    const { name, email } = request.body;

    pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name,email], (error,results) => {
        if(error){
            throw error
        } 
        response.status(200).send(`user modified with id:${id}`)
    })
}

const deleteUser = (request, response) => {
    const id = request.params.id;

    pool.query('DELETE FROM users WHERE id = $1',[id], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).send(`user deleted with id: ${id}`)
    })
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}