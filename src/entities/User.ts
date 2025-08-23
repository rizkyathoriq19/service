export interface UserJWTDAO {
    id:string 
    name:string
    username:string
}

export interface UserLoginDTO {
    username:string 
    password:string
}

export interface UserRegisterDTO {
    name:string 
    username:string 
    password: string
    address: string
}

export function exclude<User, Key extends keyof User>(
    user: User,
...keys: Key[]
): Omit<User, Key> {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
