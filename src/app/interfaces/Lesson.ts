import {Comment} from './Comment';
import {Todo} from './Todo';
export interface Lesson {
    id: string,
    createdBy: string, // uid of the instructor who created this lesson
    date: string,
    modDate?: string, // if lesson is ever modified, this gets added
    modBy?: string, // if lesson is ever modified, shows who modified it
    // profile: general info, user adds/removes. (list of profile items basically)
    profile: {
        name: string,
        content: string
    }[],
    // notes: general comments about the lesson, current state, etc.
    notes: string,
    notesComments: Comment[],
    // sections: parts of the lesson, i.e. marimba, snare, .. whatever
    sections: {
        name: string,
        desc: string,
        tags: string[],
        comments: string,
        successes: {name: string, desc: string}[],
        improvements: {name: string, desc: string}[],
        sectionComments: Comment[]
    }[];
    // list of the todos added for this lesson (ids, get data from user's studio profile)
    newTodos: string[],
    // used in the lesson editor for saving/loading
    todos?: Todo[]
}