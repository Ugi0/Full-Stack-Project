const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";
import { toPriority, fromPriority } from "../utils/toPriority";
import { toStatus, fromStatus } from "../utils/toStatus";

module.exports = function(app) {

app.get('/projects', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('projects')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
        success: true,
        data: result.map((e,i) => {
            return {
            id: e.id, time: e.time,
            status: toStatus(e.status), type: e.type,
            priority: toPriority(e.priority),
            title: e.title, description: e.description,
            data: e.data
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
    
    app.post('/projects', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.project) throw new Error("No project specified")
        const newID = req.body.project.id ?? getRandomID();
        const data = req.body.project;
        const project = {
        creator: decoded.data,
        id: newID, time: data.time,
        status: fromStatus(data.status), type: data.type,
        priority: fromPriority(data.priority),
        title: data.title, description: data.description,
        data: data.data
        }
        await db
        .insertInto('projects')
        .values(project)
        .onDuplicateKeyUpdate(project)
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
    
    app.delete('/projects', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .deleteFrom('projects')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No project with that id found")
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