import { Types } from "mongoose"

export class UserDto {
    _id: Types.ObjectId
    email: string
    password: string
    roles: string[]
}