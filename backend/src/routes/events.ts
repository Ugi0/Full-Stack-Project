const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

app.get('/events', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('events')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
        success: true,
        data: result.map((e,i) => {
            return {
            id: e.id, time: e.time,
            title: e.title, description: e.description,
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
    
    app.post('/events', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.event) throw new Error("No events specified")
        const newID = req.body.event.id ?? getRandomID();
        const data = req.body.event;
        const event = {
            creator: decoded.data,
            id: newID,
            time: data.time,
            title: data.title,
            description: data.description,
            completed: data.completed
        }
        await db
        .insertInto('events')
        .values(event)
        .onDuplicateKeyUpdate(event)
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
    
    app.delete('/events', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .deleteFrom('events')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No event with that id found")
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