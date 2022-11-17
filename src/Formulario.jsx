import React, { useState, useEffect } from 'react';
import { firebase } from './firebase';
import { nanoid } from 'nanoid';

const Formulario = () => {

    const objPersona = {
        nombre: '',
        apellido: '',
        profesion: '',
        edad: '',
        sexo: '',
        telefono: '',
        cumpleaños: " ",
    }

    const [persona, setpersona] = useState(objPersona);
    const [lista, setLista] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState('')
    const [error, setError] = useState(null);
    const [fechaNacimiento, setFechaNacimiento] = React.useState("");


    useEffect(() => {
        const obtenerDatos = async () => {
            try {

                const db = firebase.firestore()
                const data = await db.collection('usuarios').get()
                const array = data.docs.map(item => (
                    {
                        id: item.id, ...item.data()
                    }
                ))

                setLista(array)

            } catch (error) {
                console.log(error)
            }
        }

        obtenerDatos()
    })


    const guardarDatos = async (e) => {
        e.preventDefault()

        if (!persona.nombre) {
            setError('¡Vacio el campo nombre!');
            return
        }

        if (!persona.apellido) {
            setError('¡Vacio el campo apellido!');
            return
        }

        if (!persona.profesion) {
            setError('¡Vacio el campo profesion!');
            return
        }

        if (!persona.edad) {
            setError('¡Vacio el campo edad!');
            return
        }

        if (!persona.telefono) {
            setError('¡Vacio el campo telefono!');
            return
        }
        if(!persona.cumpleaños){
            setError('Ingrese La Fecha')
            return
        }

        try {

            const db = firebase.firestore();
            const personaNueva = {
                ...persona,
            }

            await db.collection('usuarios').add(personaNueva);

            setLista([...lista,
            { id: nanoid(), ...persona }
            ])

        } catch (error) {
            console.log(error)
        }

        setModoEdicion(false)
        setpersona(objPersona)
        setError(null)

    }

    const deleteConfirm = (id) => {
        let opcion = window.confirm('¿Está seguro que desea eliminar?')

        if (!opcion) {
        } else {

            eliminar(id);
        }

    }

    const eliminar = async (id) => {
        try {
            const db = firebase.firestore()
            await db.collection('usuarios').doc(id).delete()
            const aux = lista.filter(item => item.id !== id)
            setLista(aux)
        } catch (error) {
            console.log(error)
        }
    }

    const auxEditar = (item) => {

        const objPersona = {
            nombre: item.nombre,
            apellido: item.apellido,
            profesion: item.profesion,
            edad: item.edad,
            telefono: item.telefono,
            cumpleaños: item.cumpleaños,
        }

        setpersona(objPersona);
        setModoEdicion(true);
        setId(item.id);

    }

    const editar = async e => {
        e.preventDefault()

        if (!persona.nombre) {
            setError('Por favor digitar nombre');
            return
        }

        if (!persona.apellido) {
            setError('Por favor digitar apellido');
            return
        }

        if (!persona.profesion) {
            setError('Por favor digitar profesion');
            return
        }

        if (!persona.edad) {
            setError('Por favor digitar edad');
            return
        }
        if(!persona.sexo){
            setError('Por favor seleccionar sexo');
            return
        }
        if (!persona.telefono) {
            setError('Campo teléfono vacío');
            return
        }
        if(!persona.cumpleaños){
            setError('Seleccione fecha');
            return
        }

        try {

            const db = firebase.firestore()
            await db.collection('usuarios').doc(id).update({
                ...persona
            })

        } catch (error) {
            console.log(error)
        }

        setpersona(objPersona);
        setModoEdicion(false)
        setError(null)

    }

    const cancelar = () => {

        setpersona(objPersona)
        setModoEdicion(false)
        setError(null)
    }

    return (
        <div className='container-xxl mt-5'>
            <h1 className='text-center'>Directorio Persona - REACT-FIREBASE xD</h1>
            <hr />
            <div className='row'>
                <div className="col-8">
                    <h4 className="text-rigth"> Total de personas {lista.length}</h4>
                    {lista.length < 1 ?
                        <h2 className='mt-5 text-center'>No hay personas listados aún</h2>:
                        <table className="table table-white">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Profesion</th>
                                    <th scope="col">Edad</th>
                                    <th scope="col">Sexo</th>
                                    <th scope="col">Teléfono</th>
                                    <th scope="col">Fecha Nacimiento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lista.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.nombre}</td>
                                            <td>{item.apellido}</td>
                                            <td>{item.profesion}</td>
                                            <td>{item.edad}</td>
                                            <td>{item.sexo}</td>
                                            <td>{item.telefono}</td>
                                            <td>{item.cumpleaños}</td>

                                            <td>
                                                <button className='btn btn-danger btn-sm float-end mx-2'
                                                    onClick={() => deleteConfirm(item.id)}>Eliminar
                                                </button>
                                                <button className='btn btn-warning btn-sm float-end'
                                                    onClick={() => auxEditar(item)}>Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div className="col-4">
                    <h4 className="text-center">
                        {
                            modoEdicion ? 'Editar persona' : 'Agregar persona'
                        }</h4>
                    <form onSubmit={modoEdicion ? editar : guardarDatos}>
                        {
                            error ? <span className='text-danger'>{error}</span> : null
                        }
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese Nombre'
                            onChange={(e) => setpersona({ ...persona, nombre: e.target.value })}
                            value={persona.nombre}

                        />
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese apellido'
                            onChange={(e) => setpersona({ ...persona, apellido: e.target.value })}
                            value={persona.apellido}
                        />
                        <input
                            className='form-control mb-2'
                            type="text"
                            placeholder='Ingrese profesion'
                            onChange={(e) => setpersona({ ...persona, profesion: e.target.value })}
                            value={persona.profesion}
                        />
                        <input
                            className='form-control mb-2'
                            type="number"
                            min={0}
                            placeholder='Ingrese Edad'
                            onChange={(e) => setpersona({ ...persona, edad: e.target.value })}
                            value={persona.edad}
                        />
                        <a>Seleccione Sexo</a>
                        <select
                            className='form-select mb-2'
                            onChange={(e) => setpersona({ ...persona, sexo: e.target.value })}
                        >
                            <option value={persona.sexo}>{persona.sexo}</option>

                            {
                                !persona.sexo

                                    ?
                                    <>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </>
                                    :

                                    (persona.sexo === 'Masculino' ?

                                        <option value="Femenino">Femenino</option>

                                        :

                                        <option value="Masculino">Masculino</option>


                                    )
                            }
                        </select>
                        <input
                            className='form-control mb-2'
                            type="number"
                            min={0}
                            placeholder='Ingrese Teléfono'
                            onChange={(e) => setpersona({ ...persona, telefono: e.target.value })}
                            value={persona.telefono}
                        />
                        <a>Fecha Nacimiento</a>
                        <input
                            className='form-control mb-2'
                            type="date"
                            placeholder='Ingrese Fecha'
                            onChange={(e) => setpersona({ ...persona, cumpleaños: e.target.value })}
                            value={persona.cumpleaños}
                        />
                        {
                            !modoEdicion ? (
                                <button className='btn btn-primary btn-block' type='submit'>Agregar</button>
                            )
                                :
                                (<>
                                    <button className='btn btn-warning btn-block' type='submit'>Editar</button>
                                    <button className='btn btn-dark btn-block mx-2' onClick={() => cancelar()}>Cancelar</button>
                                </>
                                )
                        }

                    </form>
                </div>
            </div>
        </div>
    );
}

export default Formulario;