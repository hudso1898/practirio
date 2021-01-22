import { Lesson } from "./Lesson";

export interface Profile {
    id: string,
    userId: string,
    studioId?: string,
    ensembleId?: string,
    lessons?: Lesson[],
    // list of todos for the user (cumulative)
    todos: {
        id: string,
        name: string,
        desc: string,
        created: Date,
        due: Date,
        finished: boolean,
        category: string,
        notes: string
    }[]
}