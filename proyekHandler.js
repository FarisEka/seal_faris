const db = require('./database')
const jwt = require('jsonwebtoken')

const createProyek = async (request, h) => {
    const { name, description } = request.payload

    try {
        const [result] = await db.execute(
            'INSERT INTO Proyek (name, description) VALUES (?, ?)',
            [name, description]
        )
        return h.response({ message: 'Proyek berhasil ditambahkan' }).code(201)
    } catch (error) {
        return h.response({ error: 'Gagal menambahkan proyek' }).code(500)
    }
}

const getProyek = async (request, h) => {
    const { id } = request.params

    try {
        // Query untuk mendapatkan proyek dan tugas-tugas yang terkait
        const [projectResult] = await db.execute(
            `SELECT p.id as projectId, p.name as projectName, p.description as projectDescription, t.id as taskId, t.title as taskTitle, t.status as taskStatus, t.description as taskDescription, u.username as assignedUser
             FROM Proyek p
             LEFT JOIN Tugas t ON p.id = t.projectId
             LEFT JOIN Users u ON t.userId = u.id
             WHERE p.id = ?`, [id]
        );

        const projectData = {
            id: projectResult[0].projectId,
            name: projectResult[0].projectName,
            description: projectResult[0].projectDescription,
            tasks: projectResult
                .filter(task => task.taskId !== null)  // Hanya sertakan tugas yang ada
                .map(task => ({
                    id: task.taskId,
                    title: task.taskTitle,
                    status: task.taskStatus,
                    description: task.taskDescription,
                    assignedUser: task.assignedUser
                }))
        };
        return h.response(projectData).code(200);
    } catch (error) {
        return h.response({ error: 'Gagal mendapatkan data proyek' }).code(500)
    }
}

const updateProyek = async (request, h) => {
    const { id } = request.params
    const { name, description } = request.payload

    try {
        await db.execute(
            'UPDATE Proyek SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return h.response({ message: 'Proyek berhasil diupdate' }).code(200)
    } catch (error) {
        return h.response({ error: 'gagal mengupdate proyek' }).code(500)
    }
}

const deleteProyek = async (request, h) => {
    const { id } = request.params

    try {
        await db.execute('DELETE FROM Proyek WHERE id = ?', [id])
        return h.response({ message: 'Proyek berhasil dihapus' }).code(200)
    } catch (error) {
        return h.response({ error: 'Gagal menghapus proyek' }).code(500)
    }
}

module.exports = { createProyek, getProyek, updateProyek, deleteProyek}