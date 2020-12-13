import { Studio } from './Studio';

export interface User {
    valid?: boolean,
    id: string,
    username: string,
    password?: string,
    email?: string,
    firstname: string,
    lastname: string,
    currentSessionId?: string,
    sessionId?: string,
    expDate?: Date,
    message?: string,
    // identify by ids
    studios?: string[],
    ensembles?: string[],
    profiles?: string[]
}