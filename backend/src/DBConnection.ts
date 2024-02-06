import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from "mysql2"

const dotenv = require('dotenv');
dotenv.config()

export interface Database {
    users: users,
    userTokens: userTokens,
    views: views,
    viewelements: viewelements,
    courses: courses,
    assignments: assignments,
    projects: projects,
    events: events,
    notes: notes,
    exams: exams
  }

interface users {
    id: bigint
    email: string
    username: string
    created_at: Date
    passwordHash: string
    passwordSalt: string
}

interface userTokens {
    userId: bigint,
    token: string,
    expiryTime: Date
}

interface views {
    id: bigint,
    creator: bigint,
    title: string,
    themecolor: string
}

interface viewelements {
    creator: bigint,
    hostid: bigint,
    id: bigint,
    type: string,
    width: number,
    height: number,
    x: number,
    y: number,
    orderNumber: number,
    data: string
}

interface courses {
    creator: bigint,
    id: bigint,
    title: string,
    time: Date,
    duration: string,
    description: string,
    repeating: string,
    repeatingTime: string
}

interface exams {
    creator: bigint,
    id: bigint,
    title: string,
    description: string,
    time: Date,
    course: bigint
}

interface assignments {
    creator: bigint,
    id: bigint,
    course: bigint,
    status: number,
    type: string,
    priority: number,
    duedate: Date,
    grade: string,
}

interface projects {
    creator: bigint,
    course: bigint,
    status: number,
    type: string,
    priority: number,
    duedate: Date,
    data: string
}

interface events {
    creator: bigint,
    id: bigint,
    time: Date,
    title: string,
    description: string
}

interface notes {
    hostid: bigint,
    creator: bigint,
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