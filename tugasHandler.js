const db = require('./database')
const jwt = require('jsonwebtoken')

const createTugas = async (request, h) => {
    const { title, description, status, username, projectName } = request.payload

    try {
        const [userResult] = await db.execute('SELECT id FROM Users WHERE username = ?', [username]);
        if (userResult.length === 0) {
            return h.response({ error: 'User not found' }).code(404);
        }
        const userId = userResult[0].id;

        const [projectResult] = await db.execute('SELECT id FROM Proyek WHERE name = ?', [projectName])
        if (projectResult.length === 0) {
            return h.response({ error: 'Project not found' }).code(404);
        }
        const projectId = projectResult[0].id;

        const [result] = await db.execute(
            'INSERT INTO Tugas (title, description, status, userId, projectId) VALUES (?, ?, ?, ?, ?)',
            [title, description, status, userId, projectId]
        )
        return h.response({
            id: result.insertId,
            message: 'Task successfully created',
            title,
            status,
            assignedUser: username,
            projectName
        }).code(201);
    } catch (error) {
        console.error('Error creating task:', error.message)
        return h.response({ error: 'Failed to create task', details: error.message }).code(500);
    }
};


const getTugas = async (request, h) => {
    const { id } = request.params

    try {
        const [rows] = await db.execute('SELECT * FROM Tugas WHERE id = ?', [id])
        if (rows.length === 0) {
            return h.response({
                id: tugas.id,
                title: tugas.title,
                description: tugas.description,
                status: tugas.status,
                userId: tugas.userId,
                projectId: tugas.projectId
            }).code(404)
        }
        return rows[0]
    } catch (error) {
        console.error('Error retrieving task:', error.message)
        return h.response({ error: 'Gagal mengambil data', details: error.message }).code(500);
    }
}

const updateTugas = async (request, h) => {
    const { id } = request.params;
    const { title, description, status, username, projectName } = request.payload;

    const validStatuses = ['pending', 'in_progress', 'completed']

    if (status && !validStatuses.includes(status)) {
        return h.response({ error: 'Invalid status value' }).code(400);
    }

    try {
        let userId = null;
        if (username) {
            const [userResult] = await db.execute('SELECT id FROM Users WHERE username = ?', [username]);
            if (userResult.length === 0) {
                return h.response({ error: 'User not found' }).code(404);
            }
            userId = userResult[0].id;
        }

        let projectId = null;
        if (projectName) {
            const [projectResult] = await db.execute('SELECT id FROM Proyek WHERE name = ?', [projectName]);
            if (projectResult.length === 0) {
                return h.response({ error: 'Project not found' }).code(404)
            }
            projectId = projectResult[0].id;
        }

        const [result] = await db.execute(
            'UPDATE Tugas SET title = ?, description = ?, status = ?, userId = ?, projectId = ? WHERE id = ?',
            [title, description, status, userId || null, projectId || null, id]
        )

        if (result.affectedRows === 0) {
            return h.response({ error: 'Task not found' }).code(404);
        }

        return h.response({
            id,
            title,
            description,
            status: status || 'No change',
            assignedUser: username || 'No change',
            projectName: projectName || 'No change'
        }).code(200);
    } catch (error) {
        console.error('Error updating task:', error.message)
        return h.response({ error: 'Gagal memperbarui data', details: error.message }).code(500);
    }
}

const deleteTugas = async (request, h) => {
    const { id } = request.params;

    try {
        await db.execute('DELETE FROM Tugas WHERE id = ?', [id])
        return h.response({ message: 'Tugas berhasil dihapus' }).code(200)
    } catch (error) {
        return h.response({ error: 'gagal menghapus tugas' }).code(500)
    }
}

module.exports = {createTugas, getTugas, updateTugas, deleteTugas }