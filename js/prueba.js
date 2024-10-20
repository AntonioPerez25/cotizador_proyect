document.addEventListener('DOMContentLoaded', function () {
    //* Código modal
    document.getElementById('open_modal').addEventListener('click', function () {
        Swal.fire({
            title: 'Cambiar contraseña',
            html: `
                <input type="password" id="password-input" class="swal2-input" placeholder="Nueva contraseña">
                <br>
                <input type="checkbox" id="toggle-password"> Mostrar contraseña
            `,
            showCancelButton: true,
            confirmButtonText: 'Cambiar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const password = document.getElementById('password-input').value;
                if (!password) {
                    Swal.showValidationMessage('Debes ingresar una contraseña');
                    return false;
                }
                if (password.length < 8) {
                    Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres');
                    return false;
                }
                return password;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevaContrasena = result.value;

                // Enviar la nueva contraseña al servidor con fetch
                fetch('../Model/reset_password.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nueva_contrasena: nuevaContrasena })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Hecho!', 'Tu contraseña ha sido cambiada.', 'success').then(() => {
                                window.location.href = '../views/cotizador.php'; // Redirige a cotizador
                            });
                        } else {
                            Swal.fire('Error', data.error || 'No se pudo cambiar la contraseña', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                    });
            }
        });
        // Funcionalidad para mostrar/ocultar la contraseña
        document.getElementById('toggle-password').addEventListener('change', function () {
            const passwordInput = document.getElementById('password-input');
            passwordInput.type = this.checked ? 'text' : 'password';
        });


        document.getElementById('toggle-password').addEventListener('change', function () {
            const passwordInput = document.getElementById('password-input');
            if (this.checked) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    });

    document.getElementById('btn_modal_add_charge').addEventListener('click', function () {
        Swal.fire({
            title: 'Agregar nuevo cargo',
            html: `
                <input type="text" id="charge-input" class="swal2-input" placeholder="Cargo">
                <br>
                <input type="number" id="salary-input" class="swal2-input" placeholder="Salario">
                <br>
                <input type="number" id="margin-input" class="swal2-input" placeholder="Margen">
            `,
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const charge = document.getElementById('charge-input').value;
                const salary = document.getElementById('salary-input').value;
                const margin = document.getElementById('margin-input').value;

                if (!charge || !salary || !margin) {
                    Swal.showValidationMessage('Llena todos los campos correctamente');
                    return false;
                }

                return { charge, salary, margin };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { charge, salary, margin } = result.value;

                fetch('../api/addCharge.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cargo: charge, salario: salary, margen: margin })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Hecho!', 'El cargo ha sido agregado exitosamente.', 'success').then(() => {
                                window.location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.error || 'No se pudo agregar el cargo', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                    });
            }
        });
    });

    document.getElementById('btn_modal_modify_charge').addEventListener('click', function () {
        fetch('../api/getCharge.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const cargos = data.cargos;

                    if (!Array.isArray(cargos)) {
                        console.error('cargos no es un array:', cargos);
                        Swal.fire('Error', 'Los datos de los cargos no están disponibles.', 'error');
                        return;
                    }

                    let selectOptions = '<option value="">Selecciona el cargo</option>';
                    cargos.forEach(cargo => {
                        selectOptions += `<option value="${cargo.id_cargo}">${cargo.cargo}</option>`;
                    });

                    Swal.fire({
                        title: 'Modificar datos',
                        html: `
                            <select id="select-id" class="swal2-input">
                                ${selectOptions}
                            </select>
                            <br>
                            <input type="text" id="modify-charge-input" class="swal2-input" placeholder="Cargo">
                            <br>
                            <input type="number" id="modify-salary-input" class="swal2-input" placeholder="Salario">
                            <br>
                            <input type="number" id="modify-margin-input" class="swal2-input" placeholder="Margen">
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Modificar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                            const charge = document.getElementById('modify-charge-input').value;
                            const salary = document.getElementById('modify-salary-input').value;
                            const margin = document.getElementById('modify-margin-input').value;

                            if (!charge || !salary || !margin) {
                                Swal.showValidationMessage('Llena todos los campos correctamente');
                                return false;
                            }

                            const selectedId = document.getElementById('select-id').value;
                            return { id: selectedId, charge, salary, margin };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const { id, charge, salary, margin } = result.value;

                            fetch('../api/updateCharge.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ id, cargo: charge, salario: salary, margen: margin })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        Swal.fire('¡Hecho!', 'El cargo ha sido modificado exitosamente.', 'success')
                                            .then(() => window.location.reload());
                                    } else {
                                        Swal.fire('Error', 'No se pudo modificar el cargo.', 'error');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                                });
                        }
                    });

                    document.getElementById('select-id').addEventListener('change', function () {
                        const selectedId = this.value;
                        const selectedCargo = cargos.find(cargo => cargo.id_cargo == selectedId);

                        if (selectedCargo) {
                            document.getElementById('modify-charge-input').value = selectedCargo.cargo;
                            document.getElementById('modify-salary-input').value = selectedCargo.salario;
                            document.getElementById('modify-margin-input').value = selectedCargo.margen_utilidad;
                        } else {
                            console.error('No se encontró un cargo para el ID seleccionado:', selectedId);
                        }
                    });
                } else {
                    Swal.fire('Error', 'No se pudieron cargar los cargos.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
            });
    });


    document.getElementById('btn_modal_delete_charge').addEventListener('click', function () {
        Swal.fire({
            title: 'Eliminar cargo',
            html: `
                <select name="select" id="select-id">
                    <option value="value1">Value 1</option>
                    <option value="value2" selected>Programador Jr</option>
                    <option value="value3">Value 3</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const password = document.getElementById('password-input').value;
                if (!password) {
                    Swal.showValidationMessage('Debes ingresar una contraseña');
                    return false;
                }
                return password;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevaContrasena = result.value;

                // Enviar la nueva contraseña al servidor con fetch
                fetch('../Model/reset_password.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nueva_contrasena: nuevaContrasena })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Hecho!', 'Tu contraseña ha sido cambiada.', 'success').then(() => {
                                window.location.href = '../views/cotizador.php'; // Redirige a cotizador
                            });
                        } else {
                            Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                    });
            }
        });

        document.getElementById('toggle-password').addEventListener('change', function () {
            const passwordInput = document.getElementById('password-input');
            if (this.checked) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    });

    document.getElementById('btn_modal_edit_other').addEventListener('click', function () {
        Swal.fire({
            title: 'Modificar datos',
            html: `
                <input type="number" id="charge-input" class="swal2-input" placeholder="Horas laborales">
                <br>
                <input type="number" id="salary-input" class="swal2-input" placeholder="Costo manufactura">
                <br>
                <input type="number" id="margin-input" class="swal2-input" placeholder="Salario">
            `,
            showCancelButton: true,
            confirmButtonText: 'Cambiar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const password = document.getElementById('password-input').value;
                if (!password) {
                    Swal.showValidationMessage('Debes ingresar una contraseña');
                    return false;
                }
                return password;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevaContrasena = result.value;

                // Enviar la nueva contraseña al servidor con fetch
                fetch('../Model/reset_password.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nueva_contrasena: nuevaContrasena })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Hecho!', 'Tu contraseña ha sido cambiada.', 'success').then(() => {
                                window.location.href = '../views/cotizador.php'; // Redirige a cotizador
                            });
                        } else {
                            Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                    });
            }
        });

        document.getElementById('toggle-password').addEventListener('change', function () {
            const passwordInput = document.getElementById('password-input');
            if (this.checked) {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    });

    //* Fin Codigo modal


});
