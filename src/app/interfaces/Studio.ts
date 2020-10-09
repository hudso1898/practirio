export interface Studio {
    id: string,
    name: string,
    description: string,
    imageURL: string,
    tags: string[],
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