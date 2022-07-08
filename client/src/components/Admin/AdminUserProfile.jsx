import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styles from '../../Styles/adminUserProfile.module.css'

export default function AdminUserProfile() {
  const id = useParams().id

  const allUsers = useSelector((state) => state.users)

  const usuario = allUsers.filter((usuario) => usuario._id === id)[0]

  console.log('wwww:', usuario)

  console.log('aaaa', id)
  return (
    <div className={styles.containerAdminProfile}>
      <h1>Manejo Perfil Administrador</h1>
      <div className={styles.containerAdmin}>
        <p className={styles.h2}>Name: {usuario.name}</p>
        <p className={styles.h2}>Surname: {usuario.surname}</p>
        <p className={styles.h2}>Email: {usuario.email}</p>
        <p className={styles.h2}>Dni: {usuario.dni}</p>
        <p className={styles.h2}>Nickname: {usuario.nickname}</p>
        <p className={styles.h2}>Birthday: {usuario.birthday}</p>
        <p className={styles.h2}>Country: {usuario.country}</p>
        <p className={styles.h2}>Phone: {usuario.phone}</p>
        <p className={styles.h2}>Address: {usuario.address}</p>
      </div>

      <h2>ORDENES</h2>
    </div>
  )
}