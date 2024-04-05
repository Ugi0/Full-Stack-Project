const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

app.get('/notes', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('notes')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
            success: true,
            data: result.map((e,i) => {
            return {
                hostid: e.hostid,
                id: e.id,
                creator: e.creator,
                icon: e.icon,
                title: e.title,
                body: e.body,
                checked: e.checked
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
    
app.post('/notes', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.note) throw new Error("No note")
        const newID = req.body.note.id ?? getRandomID();
        const data = req.body.note;
        const note = {
            hostid: data.hostid,
            id: newID,
            creator: decoded.data,
            icon: data.icon,
            title: data.title,
            body: data.body,
            checked: data.checked
        }
        await db
        .insertInto('notes')
        .values(note)
        .onDuplicateKeyUpdate(note)
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

app.delete('/notes', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.id) throw new Error("No id for note specified")
        let result = await db
        .deleteFrom('notes')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No note with that id found")
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