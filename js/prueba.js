async function obtenerCargos() {
    try {
        const response = await fetch('../api/getCharge.php');
        const data = await response.json();

        if (data.success) {
            const cargos = data.cargos;
            mostrarCargosEnTabla(cargos);
        } else {
            console.error('Error al obtener los cargos:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function obtenerDatosConfiguracion() {
    try {
        const response = await fetch('../api/getConfig.php');
        const data = await response.json();

        if (data.success) {
            return data.config;
        } else {
            console.error('Error al obtener la configuración:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function mostrarCargosEnTabla(cargos, costo_manufactura, horas_laborales) {
    const tbody = document.getElementById('table_body_charges');
    tbody.innerHTML = '';

    let totalSalarios = 0;

    cargos.forEach(cargo => {
        const salarioNumerico = parseFloat(cargo.salario);
        totalSalarios += salarioNumerico;
    });

    cargos.forEach(cargo => {
        const fila = document.createElement('tr');

        const celdaCargo = document.createElement('td');
        celdaCargo.textContent = cargo.cargo;
        celdaCargo.classList.add('td_charge');
        fila.appendChild(celdaCargo);

        const salarioNumerico = parseFloat(cargo.salario);

        const celdaSalario = document.createElement('td');
        celdaSalario.textContent = `$${salarioNumerico.toFixed(2)}`;
        celdaSalario.classList.add('td_salary');
        fila.appendChild(celdaSalario);

        const celdaSalarioXHora = document.createElement('td');
        const salarioXHora = (salarioNumerico / horas_laborales).toFixed(2);
        celdaSalarioXHora.textContent = `$${salarioXHora}`;
        celdaSalarioXHora.classList.add('td_salary_x_hour');
        fila.appendChild(celdaSalarioXHora);

        const porcentajeNomina = ((salarioNumerico / totalSalarios) * 100).toFixed(1);
        const celdaNomina = document.createElement('td');
        celdaNomina.textContent = `${porcentajeNomina}%`;
        celdaNomina.classList.add('td_nomina');
        fila.appendChild(celdaNomina);

        const manuMensual = (costo_manufactura * (salarioNumerico / totalSalarios)).toFixed(2);
        const celdaManuMensual = document.createElement('td');
        celdaManuMensual.textContent = `$${manuMensual}`;
        celdaManuMensual.classList.add('td_manu_mensual');
        fila.appendChild(celdaManuMensual);

        const manuHora = (manuMensual / horas_laborales).toFixed(2);
        const celdaManuHora = document.createElement('td');
        celdaManuHora.textContent = `$${manuHora}`;
        celdaManuHora.classList.add('td_manu_hora');
        fila.appendChild(celdaManuHora);

        const margenUtilidad = parseFloat(cargo.margen_utilidad) / 100;
        const celdaMargen = document.createElement('td');
        celdaMargen.textContent = `${margenUtilidad}%`;
        celdaMargen.classList.add('td_margin');
        fila.appendChild(celdaMargen);

        const horaEsc = (parseFloat(salarioXHora) + parseFloat(manuHora)).toFixed(2);
        const celdaHoraEsc = document.createElement('td');
        celdaHoraEsc.textContent = `$${horaEsc}`;
        celdaHoraEsc.classList.add('td_hora_esc');
        fila.appendChild(celdaHoraEsc);

        const horaCli = (parseFloat(horaEsc * 2)).toFixed(2);
        const celdaHoraCli = document.createElement('td');
        celdaHoraCli.textContent = `$${horaCli}`;
        celdaHoraCli.classList.add('td_hora_cli');
        fila.appendChild(celdaHoraCli);

        const horaCap = (parseFloat(horaEsc * 3) + parseFloat(horaCli)).toFixed(2);
        const celdaHoraCap = document.createElement('td');
        celdaHoraCap.textContent = `$${horaCap}`;
        celdaHoraCap.classList.add('td_hora_cap');
        fila.appendChild(celdaHoraCap);

        const precioEsc = (horaEsc / (1 - margenUtilidad)).toFixed(2);
        const celdaPrecioEsc = document.createElement('td');
        celdaPrecioEsc.textContent = `$${precioEsc}`;
        celdaPrecioEsc.classList.add('td_price_esc');
        fila.appendChild(celdaPrecioEsc);

        const precioEscIva = (precioEsc * 1.16).toFixed(2);
        const celdaPrecioEscIva = document.createElement('td');
        celdaPrecioEscIva.textContent = `$${precioEscIva}`;
        celdaPrecioEscIva.classList.add('td_price_iva_esc');
        fila.appendChild(celdaPrecioEscIva);

        const precioCli = (horaCli / (1 - margenUtilidad)).toFixed(2);
        const celdaPrecioCli = document.createElement('td');
        celdaPrecioCli.textContent = `$${precioCli}`;
        celdaPrecioCli.classList.add('td_price_cli');
        fila.appendChild(celdaPrecioCli);

        const precioCliIva = (precioCli * 1.16).toFixed(2);
        const celdaPrecioCliIva = document.createElement('td');
        celdaPrecioCliIva.textContent = `$${precioCliIva}`;
        celdaPrecioCliIva.classList.add('td_price_iva_cli');
        fila.appendChild(celdaPrecioCliIva);

        const precioCap = (horaCap / (1 - margenUtilidad)).toFixed(2);
        const celdaPrecioCap = document.createElement('td');
        celdaPrecioCap.textContent = `$${precioCap}`;
        celdaPrecioCap.classList.add('td_price_cap');
        fila.appendChild(celdaPrecioCap);

        const precioCapIva = (precioCap * 1.16).toFixed(2);
        const celdaPrecioCapIva = document.createElement('td');
        celdaPrecioCapIva.textContent = `$${precioCapIva}`;
        celdaPrecioCapIva.classList.add('td_price_iva_cap');
        fila.appendChild(celdaPrecioCapIva);

        tbody.appendChild(fila);
    });

    const filaTotal = document.createElement('tr');
    const celdaTotalTexto = document.createElement('td');
    celdaTotalTexto.textContent = 'Total';
    filaTotal.appendChild(celdaTotalTexto);

    const celdaTotalSalario = document.createElement('td');
    celdaTotalSalario.textContent = `$${totalSalarios.toFixed(2)}`;
    celdaTotalSalario.classList.add('td_total');
    filaTotal.appendChild(celdaTotalSalario);

    tbody.appendChild(filaTotal);
}

async function obtenerCargosYConfig() {
    try {
        const cargosResponse = await fetch('../api/getCharge.php');
        const cargosData = await cargosResponse.json();

        const config = await obtenerDatosConfiguracion();

        if (cargosData.success && config) {
            const cargos = cargosData.cargos;
            const costo_manufactura = parseFloat(config.costo_manufactura);
            const horas_laborales = parseFloat(config.horas_laborales);

            mostrarCargosEnTabla(cargos, costo_manufactura, horas_laborales);
            actualizarTablaConDatos(config);
        } else {
            console.error('Error al obtener los datos de cargos o configuración');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function actualizarTablaConDatos(config) {
    if (config) {
        const costo_manufactura = `${config.costo_manufactura}`;
        const horas_laborales = `${config.horas_laborales}`;

        document.querySelector('.average').textContent = `$${costo_manufactura}`;
        document.querySelector('.hours_lab').textContent = `${horas_laborales} hrs`;
        document.querySelector('.hours_fac').textContent = `${(horas_laborales * 0.8).toFixed(1)} hrs`;
        document.querySelector('.hours_nofac').textContent = `${(horas_laborales * 0.2).toFixed(1)} hrs`;
    } else {
        console.error('No se pudieron cargar los datos de configuración');
    }
}

function cargarDatosConfiguracionEnTabla() {
    obtenerDatosConfiguracion()
        .then(config => {
            actualizarTablaConDatos(config);
        });
}

document.addEventListener('DOMContentLoaded', function () {

    cargarDatosConfiguracionEnTabla();
    obtenerCargosYConfig();

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
                        title: 'Eliminar cargo',
                        html: `
                            <select id="select-id" class="swal2-input">
                                ${selectOptions}
                            </select>
                            <br>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Eliminar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                            const selectedId = document.getElementById('select-id').value;
                            console.log(selectedId);
                            return { id: selectedId };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const { id } = result.value;

                            fetch('../api/deleteCharge.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ id })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data);
                                    if (data.success) {
                                        Swal.fire('¡Hecho!', 'El cargo ha sido eliminado exitosamente.', 'success')
                                            .then(() => window.location.reload());
                                    } else {
                                        Swal.fire('Error', 'No se pudo eliminar el cargo.', 'error');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                                });
                        }
                    });
                } else {
                    Swal.fire('Error', 'No se pudieron obtener los cargos.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Hubo un problema al obtener los cargos.', 'error');
            });
    });

    document.getElementById('btn_modal_edit_other').addEventListener('click', function () {
        fetch('../api/getConfig.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const config = data.config;

                    Swal.fire({
                        title: 'Modificar datos',
                        html: `
                            <input type="text" id="modify-cost-input" class="swal2-input" placeholder="Hora Laboral" value="${config.horas_laborales}">
                            <br>
                            <input type="number" id="modify-hours-input" class="swal2-input" placeholder="Costo manufactura mensual" value="${config.costo_manufactura}">
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Modificar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                            const cost = document.getElementById('modify-cost-input').value;
                            const hour = document.getElementById('modify-hours-input').value;

                            if (!cost || !hour) {
                                Swal.showValidationMessage('Llena todos los campos correctamente');
                                return false;
                            }
                            return { cost, hour };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const { cost, hour } = result.value;

                            fetch('../api/updateConfig.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ cost, hour })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        Swal.fire('¡Hecho!', 'Los datos han sido modificados exitosamente.', 'success')
                                            .then(() => window.location.reload());
                                    } else {
                                        Swal.fire('Error', 'No se pudo actualizar los datos.', 'error');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
                                });
                        }
                    });
                } else {
                    Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Hubo un problema con el servidor.', 'error');
            });
    });
    //* Fin Codigo modal
    
    //* Tabla 2
    let tableCounter = 1;

    document.getElementById('btn_add_charge').addEventListener('click', function () {
        const container = document.createElement('div');
        container.classList.add('table-container');
        container.setAttribute('id', `container_${tableCounter}`);

        const tableId = `table_${tableCounter}`;

        const tableHTML = `
        <table id="${tableId}" class="hours_dedicated">
            <thead>
                <tr>
                    <th class="cell_esc th">H/Esc</th>
                    <th class="cell_cli th">H/Cli</th>
                    <th class="cell_cap th">H/Cap</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="3">
                        <select name="charges" id="select_charges_${tableCounter}">
                            <option value="">Selecciona el cargo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="td_hours_esc" contenteditable="true"></td>
                    <td class="td_hours_cli" contenteditable="true"></td>
                    <td class="td_hours_cap" contenteditable="true"></td>
                </tr>
                <tr>
                    <td class="td_hours_esc" contenteditable="true"></td>
                    <td class="td_hours_cli" contenteditable="true"></td>
                    <td class="td_hours_cap" contenteditable="true"></td>
                </tr>
                <tr>
                    <td class="td_hours_esc" contenteditable="true"></td>
                    <td class="td_hours_cli" contenteditable="true"></td>
                    <td class="td_hours_cap" contenteditable="true"></td>
                </tr>
                <tr>
                    <td class="td_hours_esc" contenteditable="true"></td>
                    <td class="td_hours_cli" contenteditable="true"></td>
                    <td class="td_hours_cap" contenteditable="true"></td>
                </tr>
                <tr>
                    <td class="td_hours_esc" contenteditable="true"></td>
                    <td class="td_hours_cli" contenteditable="true"></td>
                    <td class="td_hours_cap" contenteditable="true"></td>
                </tr>
                <tr>
                    <td class="hours_esc"></td>
                    <td class="hours_cli"></td>
                    <td class="hours_cap"></td>
                </tr>
                <tr>
                    <td class="no_iva_esc"></td>
                    <td class="no_iva_cli"></td>
                    <td class="no_iva_cap"></td>
                </tr>
                <tr>
                    <td class="iva_esc"></td>
                    <td class="iva_cli"></td>
                    <td class="iva_cap"></td>
                </tr>
            </tbody>
        </table>
        `;

        container.innerHTML = tableHTML;

        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = "Eliminar Tabla";
        eliminarBtn.addEventListener('click', function () {
            eliminarTabla(tableId); 
        });

        container.appendChild(eliminarBtn);

        document.getElementById('container_hours_dedicated').appendChild(container);

        tableCounter++;
    });

    function eliminarTabla(tableId) {
        const tableContainer = document.getElementById(`container_${tableId.split('_')[1]}`);
        if (tableContainer) {
            tableContainer.remove();
        }
    }
    //* Fin Tabla 2
});
