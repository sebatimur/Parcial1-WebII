const baseURL = "https://68c4a9c881ff90c8e61cc612.mockapi.io"; // URL de la API

//! GET --> Traemos la info de todos los alumnos y la mostramos
axios.get(`${baseURL}/Alumnos`)
  .then(response => {
    console.log("Usuarios recibidos:", response.data);
    const body = document.querySelector("body");
    response.data.forEach(user => {
      const div = document.createElement("div");
      div.classList.add("alumno-card");
      div.textContent = `ID: ${user.id} | ${user.firstName} ${user.lastName} | ${user.age} años | Aula: ${user.gardenRoom} | Contacto: ${user.emergencyContact} (${user.typeContact}) - TEL: ${user.emergencyPhone}`;
      body.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Error en la petición GET:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No se pudieron cargar los alumnos",
      draggable: true
    });
  });

//! POST --> Pegamos la informacion del nuevo alumno harcodeado mediante un botón
const btnAgregar = document.getElementById("btn-agregar");
btnAgregar.addEventListener("click", () => {
  const user = {  
    firstName: "Claudio",
    lastName: "Perez",
    age: 3,
    gardenRoom: "Amarilla",
    emergencyContact: "Julian",
    emergencyPhone: 745826696,
    typeContact: "Padre"
  };

  axios.post(`${baseURL}/Alumnos`, user)
    .then(respuesta => {
      console.log("Usuario agregado:", respuesta.data);

      Swal.fire({
        title: "¡Alumno agregado!",
        icon: "success",
        text: `${respuesta.data.firstName} ${respuesta.data.lastName} fue agregado correctamente`,
        draggable: true,
        position: "center",
        showConfirmButton: true
      });

      const body = document.querySelector("body");
      const p = document.createElement("p");
      p.textContent = `ID: ${respuesta.data.id} | ${respuesta.data.firstName} ${respuesta.data.lastName} | ${respuesta.data.age} años | Aula: ${respuesta.data.gardenRoom} | Contacto de Emergencia: ${respuesta.data.emergencyContact} (${respuesta.data.typeContact}) ${respuesta.data.emergencyPhone}`;
      body.appendChild(p);
    })
    .catch(error => {
      console.error("Error al agregar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        draggable: true
      });
    });
});

//! EDIT --> Editamos la info de un alumno con un mini formulario pidiendo la nueva info
const btnEditar = document.getElementById("btn-editar");

//-- Aca se solicita la nueva info (me ayude con IA un poco en esta partae)
btnEditar.addEventListener("click", () => {
  Swal.fire({
    title: "Editar Alumno",
    html: `
      <input id="editId" type="number" class="swal2-input" placeholder="ID del Alumno">
      <input id="editFirstName" class="swal2-input" placeholder="Nombre">
      <input id="editLastName" class="swal2-input" placeholder="Apellido">
      <input id="editAge" type="number" class="swal2-input" placeholder="Edad">
      <input id="editGardenRoom" class="swal2-input" placeholder="Aula">
      <input id="editEmergencyContact" class="swal2-input" placeholder="Contacto de emergencia">
      <input id="editTypeContact" class="swal2-input" placeholder="Tipo de contacto">
      <input id="editEmergencyPhone" type="tel" class="swal2-input" placeholder="Teléfono">
    `,
    confirmButtonText: "Guardar cambios",
    showCancelButton: true,
    focusConfirm: false,
    draggable: true,
    preConfirm: () => {
      return {
        id: document.getElementById("editId").value,
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        age: document.getElementById("editAge").value,
        gardenRoom: document.getElementById("editGardenRoom").value,
        emergencyContact: document.getElementById("editEmergencyContact").value,
        typeContact: document.getElementById("editTypeContact").value,
        emergencyPhone: document.getElementById("editEmergencyPhone").value
      };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const updatedUser = result.value;
      const id = updatedUser.id;

      axios.put(`${baseURL}/Alumnos/${id}`, updatedUser)
        .then(respuesta => {
          console.log("Usuario actualizado:", respuesta.data);
          Swal.fire({
            title: "¡Alumno actualizado!",
            icon: "success",
            text: `${respuesta.data.firstName} ${respuesta.data.lastName} se actualizó correctamente`,
            draggable: true,
            showConfirmButton: true
          }).then(() =>{
            location.reload(); //-- Para que se recargue automaticamente la pagina
          });
        })
        .catch(error => {
          console.error("Error al actualizar usuario:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo actualizar el alumno",
            draggable: true
          });
        });
    }
  });
});

//! DELETE --> Eliminamos un alumno solicitando el ID, para saber cual
const btnBorrar = document.getElementById("btn-delete");

btnBorrar.addEventListener("click", () => {
  Swal.fire({
    title: "Borrar Alumno",
    html: `<input id="deleteId" type="number" class="swal2-input" placeholder="ID del Alumno">`,
    confirmButtonText: "Borrar",
    showCancelButton: true,
    focusConfirm: false,
    draggable: true,
    preConfirm: () => {
      return document.getElementById("deleteId").value;
    }
  }).then(result => {
    if (result.isConfirmed) {
      const id = result.value;

      axios.delete(`${baseURL}/Alumnos/${id}`)
        .then(respuesta => {
          console.log("Alumno borrado:", respuesta.data);
          Swal.fire({
            icon: "success",
            title: `Alumno con ID ${id} borrado correctamente`,
            showConfirmButton: true,
            timer: 1500,
            draggable: true
          }).then(() =>{
            location.reload(); //-- Para que se recargue automaticamente la pagina
          });
        })
        .catch(error => {
          console.error("Error al borrar usuario:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se pudo borrar el alumno",
            draggable: true
          });
        });
    }
  });
});