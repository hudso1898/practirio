import { Profile } from "./Profile";

export interface Studio {
    id: string,
    name: string,
    description: string,
    imageURL: string,
    tags: string[],
    // identify users by their user IDs
    instructors: {
        id: string,
        profile: Profile
    }[],
    assistants: {
        id: string,
        profile: Profile
    }[],
    students: {
        id: string,
        profile: Profile
    }[],
    applicants?: string[]
}