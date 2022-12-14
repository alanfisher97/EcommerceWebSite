// Importanto useState para el manejo del estado inicial
// Importando useContext para el uso del archivo AuthContext 
import React, { useState, createContext, useCallback } from "react";
/*Importando las funciones que se encuentran dentronde  AuthService (conexion con la apiBackEnd) */
import {
  loginService,
  signupSerivce,
  verifyingTokenService,
} from "../services/authServices";
/* Importando sweetalert */
import Swal from 'sweetalert2';

/* Creando el context (AuthContext y poder pasar su información) a sus paginas hijas */

export const AuthContext = createContext({});

const dangerAlert = async (message) =>{
  const Toast = Swal.mixin({
    toast: true,
    //position: 'bottom-end',
    position: 'center',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2000,
   // timerProgressBar: true
  })

  await Toast.fire({
    icon: 'error',
    title: message
  })
}


const warningAlert = async (message) =>{
  const Toast = Swal.mixin({
    toast: true,
    //position: 'bottom-end',
    position: 'center',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2000,
   // timerProgressBar: true
  })

  await Toast.fire({
    icon: 'warning',
    title: message
  })
}

/* Declarando el estado inicial de mi objeto (user)*/
const intialState = {
  id: null,
  email: null,
  userName: null,
  password: null,
  authStatus: false,
  rol: null,
};

/* Recibe todos los componentes que se encuentren dentro de auth provider */
export const AuthProvider = ({ children }) => {
  /* Guardar el estado (useState) en una variable global */
  const [auth, setAuth] = useState(intialState);

  const login = async (form) => {
    try {
      /* En esta parte lo que se hace ahora es que se hara uso del servicio de authService para que ahora
         ese authService pase de manera global a todas las demás rutas */
      const data = await loginService(form);
      setAuth({
        id: data.data.id,
        name: data.data.name,
        lastName: data.data.lastName,
        email: data.data.email,
        userName: data.data.userName,
        password: data.data.password,
        authStatus: true,
        rol: data.data.rol,
      });
      localStorage.setItem("token", data.token);
    } catch (error) {
      let message = error.response.data.msg;
      dangerAlert(message);
    }
  };

  const signup = async (form) => {
    try {
      const data = await signupSerivce(form);
      console.log(data)
      setAuth({
        id: data.data.id,
        name: data.data.name,
        lastName: data.data.lastName,
        email: data.data.email,
        userName: data.data.userName,
        password: data.data.password,
        authStatus: true,
        rol: data.data.rol,
      });
  
      localStorage.setItem("token", data.token);
    } catch (error) {
      let message = error.response.data.msg;
      warningAlert(message);
    }
  };

  const verifyingToken = useCallback(
    async () => {
      //console.log('Ejecuntando la verificación del token')
      const token = localStorage.getItem("token");
  
      if (token) {
       // console.log("ejecutando verifyingToken");
        const resp = await verifyingTokenService();
        localStorage.setItem("token", resp.token);
  
        setAuth({
          id: resp.data.id,
          name: resp.data.name,
          lastName: resp.data.lastName,
          userName: resp.data.userName,
          email: resp.data.email,
          password: resp.data.password,
          authStatus: true,
          rol:resp.data.rol,
        });
      } else {
        //console.log("VerifyingToken, no hay token");
        localStorage.removeItem("token");
        setAuth({
          id: null,
          name: null,
          lastName: null,
          userName: null,
          email: null,
          password: null,
          authStatus: false,
          rol: null,
        });
      }
    },
    []
  )
  


  /* Función para vericar el token de la aplicación */
  // const verifyingToken = async () => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     console.log("ejecutando verifyingToken");
  //     const resp = await verifyingTokenService();
  //     localStorage.setItem("token", resp.token);

  //     setAuth({
  //       id: resp.data.id,
  //       name: resp.data.name,
  //       lastName: resp.data.lastName,
  //       username: resp.data.username,
  //       email: resp.data.email,
  //       password: resp.data.password,
  //       authStatus: true,
  //     });
  //   } else {
  //     console.log("VerifyingToken, no hayh token");
  //     localStorage.removeItem("token");
  //     setAuth({
  //       id: null,
  //       name: null,
  //       lastName: null,
  //       username: null,
  //       email: null,
  //       password: null,
  //       authStatus: false,
  //     });
  //   }
  // };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({
      id: null,
      name: null,
      lastName: null,
      email: null,
      password: null,
      authStatus: false,
      rol: null,
    });
  };

  return (
    /* Exportando la variable de estado y la función mediante las props de AuthProvider */
    <AuthContext.Provider value={{ auth, login, signup, verifyingToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
