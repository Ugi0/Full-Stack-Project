import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from "mysql2"

const dotenv = require('dotenv');
dotenv.config()

export interface Database {
    users: users,
    views: views,
    viewelements: viewelements,
    courses: courses,
    lectures: lectures,
    assignments: assignments,
    projects: projects,
    events: events,
    notes: notes,
    exams: exams
  }

interface users {
    id: string
    email: string
    username: string
    created_at: Date
    passwordHash: string
    passwordSalt: string
}

interface views {
    id: string,
    creator: string,
    title: string
}

interface viewelements {
    creator: string,
    hostid: string,
    id: string,
    type: number,
    size: number,
    width: number,
    height: number,
    x: number,
    y: number,
    data: string
}

interface courses {
    creator: string,
    id: string,
    title: string,
    description: string,
    subject: string
}

interface lectures {
    creator: string,
    id: string,
    course: string,
    time: string,
    duration: string,
    description: string,
    creationID: string,
    completed: boolean
}

interface exams {
    creator: string,
    id: string,
    title: string,
    description: string,
    time: Date,
    course: string,
    completed: boolean
}

interface assignments {
    title: string,
    description: string,
    creator: string,
    id: string,
    course: string,
    priority: number,
    status: number,
    time: Date,
    grade: string,
    completed: boolean
}

interface projects {
    creator: string,
    title: string,
    description: string,
    id: string,
    status: number,
    type: string,
    priority: number,
    time: Date,
    data: string,
    completed: boolean
}

interface events {
    creator: string,
    id: string,
    time: Date,
    title: string,
    description: string,
    completed: boolean
}

interface notes {
    hostid: string,
    creator: string,
    icon: string,
    title: string,
    body: string,
    checked: boolean
}

const dialect = new MysqlDialect({ 
    pool: async () => createPool({
        host: process.env.DATABASE_LOCATION,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    })
})

export const db = new Kysely<Database>({
    dialect,
})