const db = require('./database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const SECRET_KEY = 'your_jwt_secret_key'

const createUser = async (request, h) => {
    const { username, email, password, avatar } = request.payload
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const [result] = await db.execute(
            'INSERT INTO Users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, avatar]
        )
        const token = jwt.sign({ id: result.insertId, username, email }, SECRET_KEY, { expiresIn: '1h' });
        return h.response({message: 'User berhasil ditambahkan',token : token }).code(201)
    } catch (error) {
        return h.response({ error: 'Gagal menambhkan user' }).code(500)
    }
};

const getUser = async (request, h) => {
    const { id } = request.params

    try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE id = ?', [id])
        if (rows.length === 0) {
            return h.response({
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }).code(404)
        }
        return rows[0]
    } catch (error) {
        return h.response({ error: 'gagal mendapatkan user' }).code(500)
    }
}

const updateUser = async (request, h) => {
    const { id } = request.params
    const { username, email, password, avatar } = request.payload
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

    try {
        await db.execute(
            'UPDATE Users SET username = ?, email = ?, password = ?, avatar = ? WHERE id = ?',
            [username, email, hashedPassword || null, avatar, id]
        );
        return h.response({ message: 'User berhasil di update' }).code(200);
    } catch (error) {
        return h.response({ error: 'Gagal update user' }).code(500)
    }
};

const deleteUser = async (request, h) => {
    const { id } = request.params

    try {
        await db.execute('DELETE FROM Users WHERE id = ?', [id])
        return h.response({ message: 'User berhasil dihapus' }).code(200)
    } catch (error) {
        return h.response({ error: 'Gagal menghapus user' }).code(500)
    }
}

module.exports = {createUser, getUser, updateUser, deleteUser}