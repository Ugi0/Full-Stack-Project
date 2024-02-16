const jwt = require('jsonwebtoken');
import { db } from "../DBConnection";
import { getRandomID } from "../utils/getRandomID";

module.exports = function(app) {

app.get('/exams', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .selectFrom('exams')
        .selectAll()
        .where('creator', '=', decoded.data)
        .execute()
        res.send({
        success: true,
        data: result.map((e,i) => {
            return {
            id: e.id, time: e.time,
            title: e.title, description: e.description,
            course: e.course
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
    
    app.post('/exams', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        if (!req.body.exam) throw new Error("No exams specified")
        const newID = req.body.exam.id ?? getRandomID();
        const data = req.body.exam;
        const exam = {
        creator: decoded.data, 
        id: newID, time: data.time,
        title: data.title, description: data.description,
        course: data.course
        }
        await db
        .insertInto('exams')
        .values(exam)
        .onDuplicateKeyUpdate(exam)
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
    
    app.delete('/exams', async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded.data) throw new Error("No token")
        let result = await db
        .deleteFrom('exams')
        .where('id', '=', req.body.id)
        .where('creator', '=', decoded.data)
        .execute()
        if (result[0].numDeletedRows === 0n) throw new Error("No exam with that id found")
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