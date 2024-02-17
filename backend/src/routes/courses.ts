const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

app.post('/courses', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.course) throw new Error("No course")
        const newID = req.body.course.id ?? getRandomID();
        const data = req.body.course;
        const course = {
        creator: decoded.data,
        id: newID,
        title: data.title, description: data.description,
        subject: data.subject
        }
        await db
        .insertInto('courses')
        .values(course)
        .onDuplicateKeyUpdate(course)
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
    
app.get('/courses', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('courses')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
        success: true,
        data: result.map((e,i) => {
            return {
            title: e.title,
            description: e.description,
            id: e.id, subject: e.subject
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
    
app.delete('/courses', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.id) throw new Error("No id specified")
        let result = await db
        .deleteFrom('courses')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No course with that id found")
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