import { useHistory } from "react-router-dom";
import {IUser} from "services/users/definitions";

import {UserForm} from "../UserForm";
import {useUsers} from "services/users/users.hook";

import { useAuth } from "context/auth";

export function CreateUser(){
    const history = useHistory();
    const {createUserMutation} = useUsers();
    const {register} = useAuth();

    const handleSubmitForm = async (data: IUser) => {
        const newUser = {
            ...data,
        };

        try {
            await register(data.email,data.password);
            await createUserMutation.mutateAsync(newUser);
            history.push(`/users`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        history.push(`/users`);
    };

    return (
        <UserForm 
        title="Crear Usuario"
        buttonTitle="Crear"
        onSubmit={handleSubmitForm}
        onCancel={handleCancel} 
        />
    );
}