import {ColumnType,Generated,Insertable,JSONColumnType,Selectable,Updateable} from 'kysely'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from "mysql2"

export interface Database {
    users: users,
    userTokens: userTokens,
    views: views,
    viewelements: viewelements,
    courses: courses,
    assignments: assignments,
    projects: projects,
    events: events,
    notes: notes
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
    courseid: bigint,
    title: string,
    startdate: Date,
    duration: number,
    description: string,
    repeating: number
    repeatingTimes: number
}

interface assignments {
    creator: bigint,
    course: bigint,
    status: number,
    type: string,
    priority: number,
    duedate: Date,
    grade: string
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
    eventTime: Date,
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
        database: 'TestDB'
    })
})

export const db = new Kysely<Database>({
    dialect,
})