# TP DSW Romero Russmann
## Bugs & Issues
### Backend
- 18/3/26, al hacer un post de un objeto Chatroom se enviaban datos incorrectos a la base de datos
- 19/3/26, al implementar la ORM por primera vez, se creo una nueva base de datos llamada 'GallumDB' en lugar de utilizar la que ya estaba usandose: 'GalliumDB'
- 19/3/26, al implementar las relaciones de las clases en el ORM los objetos se creaban correctamente con las relaciones, pero al obtenerlos de la base de datos no se obtenian los datos de las relaciones correspondientes
- 3/4/26, al hacer una consulta de un objeto que contiene un arreglo de chatrooms no devuelve el arreglo de mensajes
- 8/4/26, al crear un objeto mensaje el back lo devuelve dentro de un objeto bajo la etiqueta data, el front no logra extraer el objeto mensaje del response y lo define como undefined
- 15/4/26, si hay usuarios creados con el mismo correo, al agregar integrantes a un chat grupal se agregan todos los usuarios que compartan ese correo
### Frontend
- 15/4/26, al enviar un input vacio ("") no realizaba las verificaciones que tenia asignadas

## Issues
- trabajar con la clase chatroom para grupos y dms agrega mucha complejidad a la logica a que si fueran dos clases distintas, a pesar de que dm en la base es lo mismo que un grupo pero con menos propiedades y no agrega nada que lo diferencie
- DM es propiedad de  dos usuarios, a la hora de borrar un chat que hago, cual es el camino a seguir?
## Features
### Backend

### Frontend
