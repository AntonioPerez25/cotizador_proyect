document.addEventListener('DOMContentLoaded', () => {
    const btnAddRow = document.getElementById('add_row_charges');
    const tableBodyCharges = document.getElementById('table_body_charges');
    const totalSalaryCell = document.querySelector('.total');
    const averageCell = document.querySelector('.average');
    const hoursLabCell = document.querySelector('.hours_lab');
    const selectCharges = document.getElementById('select_charges'); // Select para los cargos

    // Selección de celdas de horas y precios
    const totalHoursCells = {
        esc: document.querySelector('.td_price_esc'),
        cli: document.querySelector('.td_price_cli'),
        cap: document.querySelector('.td_price_cap'),
    };

    const hoursCells = {
        lab: document.querySelector('.hours_lab'),
        fac: document.querySelector('.hours_fac'),
        noFac: document.querySelector('.hours_nofac'),
    };

    // Formateadores
    const formatterPesos = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    });

    const formatMargin = (value) => value.toFixed(0) + '%';

    const updateHourCells = () => {
        const hoursLab = parseFloat(hoursCells.lab.textContent) || 0;
        hoursCells.fac.textContent = (hoursLab * 0.8).toFixed(1);
        hoursCells.noFac.textContent = (hoursLab * 0.2).toFixed(1);
    };

    const calculateRow = (row, totalSalary) => {
        const salaryCell = row.querySelector('.td_salary');
        const salary = parseFloat(salaryCell.textContent) || 0;
        const average = parseFloat(averageCell.textContent) || 0;
        const hoursLab = parseFloat(hoursCells.lab.textContent) || 0;
        const margin = parseFloat(row.querySelector('.td_margin').textContent.replace('%', '').trim()) / 100;

        const salaryXHour = salary / hoursLab;
        row.querySelector('.td_salary_x_hour').textContent = formatterPesos.format(salaryXHour);

        const nomina = ((salary / totalSalary) * 100).toFixed(0);
        row.querySelector('.td_nomina').textContent = nomina + '%';

        const manuMonth = (average * (nomina / 100)).toFixed(2);
        row.querySelector('.td_manu_month').textContent = formatterPesos.format(manuMonth);

        const manuHour = (manuMonth / hoursLab).toFixed(2);
        row.querySelector('.td_manu_hour').textContent = formatterPesos.format(manuHour);

        const hourEsc = (salaryXHour + parseFloat(manuHour)).toFixed(2);
        row.querySelector('.td_hour_esc').textContent = formatterPesos.format(hourEsc);

        const hourCli = (hourEsc * 2).toFixed(2);
        row.querySelector('.td_hour_cli').textContent = formatterPesos.format(hourCli);

        const hourCap = ((hourEsc * 3) + parseFloat(hourCli)).toFixed(2);
        row.querySelector('.td_hour_cap').textContent = formatterPesos.format(hourCap);

        const priceEsc = (hourEsc / (1 - margin)).toFixed(2);
        const priceCli = (hourCli / (1 - margin)).toFixed(2);
        const priceCap = (hourCap / (1 - margin)).toFixed(2);

        row.querySelector('.td_price_esc').textContent = formatterPesos.format(priceEsc);
        row.querySelector('.td_price_iva_esc').textContent = formatterPesos.format(priceEsc * 1.16);
        row.querySelector('.td_price_cli').textContent = formatterPesos.format(priceCli);
        row.querySelector('.td_price_iva_cli').textContent = formatterPesos.format(priceCli * 1.16);
        row.querySelector('.td_price_cap').textContent = formatterPesos.format(priceCap);
        row.querySelector('.td_price_iva_cap').textContent = formatterPesos.format(priceCap * 1.16);
    };

    const updateTotalSalary = () => {
        let totalSalary = 0;
        document.querySelectorAll('.td_salary').forEach(cell => {
            const salary = parseFloat(cell.textContent) || 0;
            totalSalary += salary;
            cell.textContent = salary;
        });
        totalSalaryCell.textContent = formatterPesos.format(totalSalary);
        return totalSalary;
    };

    const updateAllRows = () => {
        const rows = tableBodyCharges.querySelectorAll('tr');
        const totalSalary = updateTotalSalary();
        rows.forEach(row => calculateRow(row, totalSalary));
        updateSelectCharges(); // Actualiza el select después de calcular todas las filas
    };

    function updateSelectCharges() {
        // Limpiar el <select>
        selectCharges.innerHTML = '<option value="">Selecciona el cargo</option>';

        // Obtener los cargos de la tabla
        const rows = tableBodyCharges.getElementsByTagName("tr");
        const chargeSet = new Set(); // Usar un Set para evitar duplicados

        for (let i = 0; i < rows.length - 1; i++) { // Excluir la fila de total
            const chargeCell = rows[i].getElementsByClassName("td_charge")[0];
            const chargeValue = chargeCell.innerText.trim();
            if (chargeValue) {
                chargeSet.add(chargeValue); // Agregar el cargo al Set
                console.log(chargeSet);
            }
        }

        // Añadir opciones al select
        chargeSet.forEach(chargeValue => {
            const option = document.createElement("option");
            option.value = chargeValue;
            option.innerText = chargeValue;
            selectCharges.appendChild(option);
        });
    }


    const addRowCharges = () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="td_charge" contentEditable="true">Nuevo Cargo</td>
            <td class="td_salary" contenteditable="true"></td>
            <td class="td_salary_x_hour"></td>
            <td class="td_nomina"></td>
            <td class="td_manu_month"><b></b></td>
            <td class="td_manu_hour"></td>
            <td class="td_margin" contenteditable="true"></td>
            <td class="td_hour_esc"></td>
            <td class="td_hour_cli"></td>
            <td class="td_hour_cap"></td>
            <td class="td_price_esc"></td>
            <td class="td_price_iva_esc"></td>
            <td class="td_price_cli"></td>
            <td class="td_price_iva_cli"></td>
            <td class="td_price_cap"></td>
            <td class="td_price_iva_cap"></td>
        `;
        tableBodyCharges.insertBefore(newRow, tableBodyCharges.querySelector('tr:last-child'));
        assignEditableEvent(newRow.querySelectorAll('[contenteditable="true"]'));
        updateAllRows();
        updateSelectCharges();
    };

    const assignEditableEvent = (cells = []) => {
        cells.forEach(cell => {
            cell.addEventListener('input', () => {
                if (['td_salary', 'td_margin'].some(className => cell.classList.contains(className)) || cell === averageCell || cell === hoursCells.lab) {
                    updateHourCells();
                    updateAllRows();
                }

                // Agregar este bloque para manejar la entrada en td_charge
                if (cell.classList.contains('td_charge')) {
                    console.log('Cambio en td_charge:', cell.innerText.trim());
                    updateSelectCharges(); // Actualiza el select al cambiar el cargo
                }
            });

            cell.addEventListener('blur', () => {
                if (cell.classList.contains('td_salary')) {
                    cell.textContent = parseFloat(cell.textContent) || 0;
                }
                if (cell.classList.contains('td_margin')) {
                    cell.textContent = formatMargin(parseFloat(cell.textContent) || 0);
                }
            });
        });
    };

    const updateTotals = () => {
        const totalEsc = Array.from(document.querySelectorAll('.td_hours_esc')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);
        const totalCli = Array.from(document.querySelectorAll('.td_hours_cli')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);
        const totalCap = Array.from(document.querySelectorAll('.td_hours_cap')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);

        document.querySelector('.hours_esc').innerText = totalEsc.toFixed(0);
        document.querySelector('.hours_cli').innerText = totalCli.toFixed(0);
        document.querySelector('.hours_cap').innerText = totalCap.toFixed(0);
    };

    // Añade eventos de escucha
    btnAddRow.addEventListener('click', addRowCharges);
    assignEditableEvent(document.querySelectorAll('[contenteditable="true"]'));
    updateHourCells();
    updateSelectCharges();

    // Escuchar cambios en las celdas de horas
    document.querySelectorAll('.td_hours_esc, .td_hours_cli, .td_hours_cap').forEach(cell => {
        cell.addEventListener('input', updateTotals);
    });
});
