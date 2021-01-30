import {Comment} from './Comment';
export interface Todo {
    id: string,
    name: string, // name/desc, created by instructor
    desc: string,
    // string-serialized dates, import these into `new Date()` to get a Date object
    created: string,
    due: string,
    finished: boolean,
    category: string,
    comments: Comment[] // student notes
}