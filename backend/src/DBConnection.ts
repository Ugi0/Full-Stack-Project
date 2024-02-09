import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from "mysql2"

const dotenv = require('dotenv');
dotenv.config()

export interface Database {
    users: users,
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

interface views {
    id: bigint,
    creator: bigint,
    title: string
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
    title: string,
    description: string,
    creator: bigint,
    id: bigint,
    course: bigint,
    priority: number,
    status: number,
    time: Date,
    grade: string,
}

interface projects {
    creator: bigint,
    title: string,
    description: string,
    id: bigint,
    status: number,
    type: string,
    priority: number,
    time: Date,
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