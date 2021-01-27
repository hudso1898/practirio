import {Comment} from './Comment';
export interface Todo {
    id: string,
    name: string, // name/desc, created by instructor
    desc: string,
    created: Date,
    due: Date,
    finished: boolean,
    category: string,
    comments: Comment[] // student notes
}