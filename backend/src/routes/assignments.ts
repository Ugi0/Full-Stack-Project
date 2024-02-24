const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";
import { toPriority, fromPriority } from "../utils/toPriority";
import { toStatus, fromStatus } from "../utils/toStatus";

module.exports = function(app) {

app.get('/assignments', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('assignments')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
        success: true,
        data: result.map((e,i) => {
            return {
                id: e.id, course: e.course,
                priority: toPriority(e.priority),
                title: e.title,
                description: e.description,
                status: toStatus(e.status),
                time: e.time,
                grade: e.grade,
                completed: e.completed
            }
        })
        })
    } catch(e) {
        console.log(e.message)
        res.send({
        success: false
        })
    }
    })
    
    app.post('/assignments', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.assignment) throw new Error("No assignments specified")
        const newID = req.body.assignment.id ?? getRandomID();
        const data = req.body.assignment;
        const assignment = {
            creator: decoded.data,
            priority: fromPriority(data.priority),
            title: data.title,
            description: data.description,
            id: newID, course: data.course,
            status: fromStatus(data.status),
            time: data.time,
            grade: data.grade,
            completed: data.completed
        }
        await db
        .insertInto('assignments')
        .values(assignment)
        .onDuplicateKeyUpdate(assignment)
        .execute()
        res.send({
        success: true,
        id: newID.toString()
        })
    } catch(e) {
        console.log(e.message)
        res.send({
        success: false
        })
    }
    })
    
    app.delete('/assignments', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .deleteFrom('assignments')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No assignment with that id found")
        res.send({
        success: true
        })
    } catch(e) {
        console.log(e.message)
        res.send({
        success: false
        })
    }
    })


}