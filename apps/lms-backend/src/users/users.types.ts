export enum UserRole {
    STUDENT = 'student',
    INSTRUCTOR = 'instructor',
    ADMIN = 'admin'
  }

export type UserCredentials = {
  id: string
  email: string
  password: string
  fullName: string
  role: UserRole
  createdAt: Date;
  updatedAt: Date;
}

type OmitSomeCredentials = Omit<UserCredentials, 'password' | 'createdAt' | 'updatedAt'>

export interface UserResponse {
  access_token: string
  user: OmitSomeCredentials
}