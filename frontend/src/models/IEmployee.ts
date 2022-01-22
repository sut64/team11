import {RoleInterface } from './IRole'

export interface EmployeeInterface {
    ID: number,
    Name: string,
    Email: string,
    Password: string
    RoleID: number,
    Role: RoleInterface,
}