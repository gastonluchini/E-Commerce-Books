
import React from 'react';

const UserDatosPerfil = ({name, surname, email, dni, nickname, birthday, country, phone, address}) => {

    return (
        <div>
            <h4>Mi perfil</h4>
            <p>Nombre: {name}</p>
            <p>Apellido: {surname}</p>
            <p>Email: {email}</p>
            <p>Usuario: {nickname}</p>
            <p>DNI: {dni}</p>
            <p>País: {country}</p>
            <p>Tel: {phone}</p>
            <p>Dirección: {address}</p>
            <p>Fecha de nacimiento: {birthday}</p>
        </div>
    )
}

export default UserDatosPerfil;