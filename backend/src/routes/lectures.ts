const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

app.get('/lectures', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('lectures')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
            success: true,
            data: result.map((e,i) => {
            return {
                id: e.id,
                course: e.course, time: e.time,
                duration: e.duration, description: e.description,
                creationID: e.creationID
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
    
app.post('/lectures', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.lecture) throw new Error("No lecture")
        const newID = req.body.lecture.id ?? getRandomID();
        const data = req.body.lecture;
        const lecture = {
            creator: decoded.data, id: newID, 
            course: data.course,
            description: data.description,
            time: data.time, duration: data.duration,
            creationID: data.creationID
        }
        await db
        .insertInto('lectures')
        .values(lecture)
        .onDuplicateKeyUpdate(lecture)
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

app.delete('/lectures', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.id) throw new Error("No id for lecture specified")
        let result = await db
        .deleteFrom('lectures')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No lecture with that id found")
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