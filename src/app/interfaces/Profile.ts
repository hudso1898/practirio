export interface Profile {
    id: string,
    userId: string,
    studioId?: string,
    ensembleId?: string,
    lessons?: {
        id: string,
        date: Date,
        // profile: general info, user adds/removes 
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
        // list of the todos added for this lesson
        newTodos: {
            name: string,
            desc: string,
            created: Date,
            due: Date,
            category: string,
            notes: string
        }[]
    }[],
    todos: {
        name: string,
        desc: string,
        created: Date,
        due: Date,
        finished: boolean,
        category: string,
        notes: string
    }[]
}