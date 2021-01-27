import { Lesson } from "./Lesson";
import { Todo } from "./Todo";

export interface Profile {
    id: string,
    userId: string,
    studioId?: string,
    ensembleId?: string,
    lessons?: Lesson[],
    // list of todos for the user (cumulative)
    todos: Todo[]
}