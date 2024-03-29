import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  postUser,
  getUsers,
  setToAdmin,
  setUserPlan,
  setUserBanned,
  setUserNews,
} from '../../../actions'
import { useSelector, useDispatch } from 'react-redux'
import AdminProSet from '../../AdminPro/Permisos/AdminProSet'
import AdminUserChangePlan from './Manejo de estados/AdminUserChangePlan'
import AdminUserBanned from './Manejo de estados/AdminUserBanned'
import AdminUserProfile from './AdminUserProfile'
import { Link } from 'react-router-dom'
import AdminSearchBarUser from '../SearchBars/AdminSearchBarUser'
import AdminRefreshUsers from '../RefreshButtons/AdminRefreshUser'
import AdminUserNewsLetter from './Manejo de estados/AdminUserNewsLetter'
import styles from '../../../Styles/AdminUser2.module.css'
import style from '../../../Styles/Stock.module.css'
import './adminUsers.css'
import { animateScroll as scroll, Element } from 'react-scroll'

// import SetAdminUser from "./SetAdminUser";
// import BannAdminUser from "./BannUser";
// import ForcePasswordResetButton from "./ForcePSWreset";

// {id: userId, changes:{isAdmin:true}}

export default function AdminUsers2(props) {
  const dispatch = useDispatch()

  const usuarios = useSelector((state) => state.users)

  function changePlan(e) {
    e.preventDefault()
    var userId = [e.target.value]
    dispatch(setUserPlan(userId))
    setTimeout(function () {
      dispatch(getUsers())
    }, 500)
  }

  function changeBan(e) {
    e.preventDefault()
    var userId = [e.target.value]
    dispatch(setUserBanned(userId))
    setTimeout(function () {
      dispatch(getUsers())
    }, 500)
  }

  function changeNews(e) {
    e.preventDefault()
    var userId = [e.target.value]
    dispatch(setUserNews(userId))
    setTimeout(function () {
      dispatch(getUsers())
    }, 500)
  }

  useEffect(() => {
    dispatch(getUsers())
  }, [])

  useEffect(() => {
    scroll.scrollToTop()
  }, [])

  return usuarios.length > 0 ? (
    <div className={styles.containerAll}>
      <h1>Control de usuarios</h1>
      <div className={styles.containerUser}>
        <Link to='/admin'>
          <button className={style.btnAdmin}>Panel de Administrador</button>
        </Link>
        <AdminRefreshUsers />
        <AdminSearchBarUser />
      </div>
      <div class='container'>
        <table class='content-table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Usuario</th>

              <th>Plan Premium</th>
              <th>Estado Bloqueado</th>
              <th>NewsLetter</th>
              <th>Administrador</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <Link to={`/adminuserprofile/${usuario._id}`}>
                    {usuario.email}
                  </Link>
                </td>

                <td>{usuario.name}</td>

                <td>
                  {usuario.isPremiun ? (
                    <label class='switch'>
                      <input
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => changePlan(e)}
                        defaultChecked={true}
                      />
                      <span class='slider round'></span>
                    </label>
                  ) : (
                    <label class='switch'>
                      <input
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => changePlan(e)}
                        defaultChecked={false}
                      />
                      <span class='slider round'></span>
                    </label>
                  )}
                </td>

                <td>
                  {' '}
                  {usuario.isBanned ? (
                    <label class='switch'>
                      <input
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => changeBan(e)}
                        defaultChecked={true}
                      />
                      <span class='slider round'></span>
                    </label>
                  ) : (
                    <label class='switch'>
                      <input
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => changeBan(e)}
                        defaultChecked={false}
                      />
                      <span class='slider round'></span>
                    </label>
                  )}
                </td>

                <td>
                  {' '}
                  {usuario.isSuscribeNewsletter ? (
                    <label class='switch'>
                      <input
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => changeNews(e)}
                        defaultChecked={true}
                      />
                      <span class='slider round'></span>
                    </label>
                  ) : (
                    <label class='switch'>
                      <input
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => changeNews(e)}
                        defaultChecked={false}
                      />
                      <span class='slider round'></span>
                    </label>
                  )}
                </td>

                <td>{usuario.isAdmin ? 'Si' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  )
}

//------------CTODO CON CHECK BOX----------------
/*
export default function AdminUsers2(props) {
  const dispatch = useDispatch()

  const usuarios = useSelector((state) => state.users)

  const [seleccionados, setSeleccionados] = useState([])

  const [changed, setChanged] = useState(false)



  function selectUser(e) {
    var userId = e.target.value
    console.log('userId:', userId)

    
 if (!e.target.checked) {
      let seleccion = seleccionados.filter((usuario) => usuario._id !== userId)
      console.log('seleccion:', seleccion)
      setSeleccionados(seleccion)
    } else {
      let usuarioCheck = usuarios.find((usuario) => usuario._id === userId)
      console.log('usuarioCheck:', usuarioCheck)

      setSeleccionados([...seleccionados, usuarioCheck])
    }
  }
useEffect(() => {
    var checkeds = document.getElementsByClassName('checkbox')
    for (let i = 0; i < checkeds.length; i++) {
      checkeds[i].checked = false
    }
    setSeleccionados([])
    dispatch(getUsers())
  }, [changed])

  useEffect(() => {}, [usuarios])


   

 


  useEffect(() => {
    dispatch(getUsers())
  }, [])

  

  useEffect(() => {
    scroll.scrollToTop()
  }, [])



return usuarios.length > 0 ? (
  <div className={styles.containerAll}>
    <h1>Control de usuarios</h1>
    <div>
      <Link to='/admin'>
        <button className={style.btnAdmin}>↼ Back</button>
      </Link>
      <br />
      <br />
      <div id='tableleft'></div>
      <div className={styles.containerFlex}>
        <div className={styles.containerActions}>
          <AdminUserChangePlan
            users={seleccionados}
            changed={changed}
            setChanged={setChanged}
          />
          <AdminUserBanned
            users={seleccionados}
            changed={changed}
            setChanged={setChanged}
          />
          <AdminUserNewsLetter
            users={seleccionados}
            changed={changed}
            setChanged={setChanged}
          />
        </div>
        <div>
          <div className={styles.containerUser}>
            <AdminRefreshUsers />
            <AdminSearchBarUser />
          </div>
          <div class='container'>
            <table class='content-table'>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Usuario</th>

                  <th>Plan</th>
                  <th>Estado</th>
                  <th>NewsLetter</th>
                  <th>Administrador</th>
                  <th>check</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <Link to={`/adminuserprofile/${usuario._id}`}>
                        {usuario.email}
                      </Link>
                    </td>

                    <td>{usuario.name}</td>

                    <td>{usuario.isPremium ? 'Si' : 'No'}</td>

                    <<td>{usuario.isBanned ? 'Si' : 'No'}</td>

                    <td>{usuario.isSubscribeNewsLetter ? 'Si' : 'No'}</td>

                    <td>{usuario.isAdmin ? 'Si' : 'No'}</td>
                    <td>
                      <input
                        className='checkbox'
                        type='checkbox'
                        value={usuario._id}
                        onChange={(e) => selectUser(e)}
                        defaultChecked={false}
                      ></input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
) : (
  <p>Loading...</p>
)
}
*/
