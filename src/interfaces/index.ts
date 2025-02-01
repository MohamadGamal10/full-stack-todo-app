
export interface IRegisterInput {
    name: "username" | "email" | "password"
    placeholder: string
    type: string
    validation: {
        required: boolean | string
        minLength?: number
        pattern?: RegExp
    }
}