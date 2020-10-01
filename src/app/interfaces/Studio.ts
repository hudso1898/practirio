export interface Studio {
    id: string,
    name: string,
    description: string,
    // identify users by their user IDs
    instructors: {
        id: string,
        profile: string
    }[],
    assistants: {
        id: string,
        profile: string
    }[],
    students: {
        id: string,
        profile: string
    }[],
}