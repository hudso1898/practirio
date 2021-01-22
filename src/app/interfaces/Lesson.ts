export interface Lesson {
    id: string,
    date: Date,
    // profile: general info, user adds/removes. (list of profile items basically)
    profile: {
        name: string,
        content: string
    }[],
    // notes: general comments about the lesson, current state, etc.
    notes: string,
    // sections: parts of the lesson, i.e. marimba, snare, .. whatever
    sections: {
        name: string,
        tags: string[],
        comments: string
    }[],
    // list of the todos added for this lesson. Maybe just make these numerical since it's per user.. plus not rly a big deal
    newTodos: string[]
}