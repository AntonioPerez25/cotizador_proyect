document.addEventListener('DOMContentLoaded', function () {
    const btnAddRow = document.getElementById('add_row_charges');
    const tableBodyCharges = document.getElementById('table_body_charges');
    const totalSalaryCell = document.querySelector('.total'); // Celda donde se mostrará el total

    const averageCell = document.querySelector('.average');
    const hoursLabCell = document.querySelector('.hours_lab');
    const hoursFacCell = document.querySelector('.hours_fac');
    const hoursNoFacCell = document.querySelector('.hours_nofac');

    function updateHourCells() {
        const hoursLab = parseFloat(hoursLabCell.textContent) || 0;
        hoursFacCell.textContent = (hoursLab * 0.8).toFixed(2);
        hoursNoFacCell.textContent = (hoursLab * 0.2).toFixed(2);
    }

    function calculateRow(row) {
        const salaryCell = row.querySelector('.td_salary');
        const salaryXHourCell = row.querySelector('.td_salary_x_hour');
        const nominaCell = row.querySelector('.td_nomina');
        const manuMonthCell = row.querySelector('.td_manu_month');
        const manuHourCell = row.querySelector('.td_manu_hour');
        const hourEscCell = row.querySelector('.td_hour_esc');
        const hourCliCell = row.querySelector('.td_hour_cli');
        const hourCapCell = row.querySelector('.td_hour_cap');
        const marginCell = row.querySelector('.td_margin');
        const priceEscCell = row.querySelector('.td_price_esc');
        const priceIvaEscCell = row.querySelector('.td_price_iva.esc');
        const priceCliCell = row.querySelector('.td_price_cli');
        const priceIvaCliCell = row.querySelector('.td_price_iva.cli');
        const priceCapCell = row.querySelector('.td_price_cap');
        const priceIvaCapCell = row.querySelector('.td_price_iva.cap');

        const salary = parseFloat(salaryCell.textContent) || 0;
        const average = parseFloat(averageCell.textContent) || 0;
        const hoursLab = parseFloat(hoursLabCell.textContent) || 0;
        const margin = parseFloat(marginCell.textContent.replace('%', '').trim()) / 100 || 0;

        // Calcular sueldo por hora
        const salaryXHour = (salary / hoursLab).toFixed(2);
        salaryXHourCell.textContent = salaryXHour;

        // Calcular % de Nómina
        const nomina = ((salary * 100) / average * 0.01).toFixed(2);
        nominaCell.textContent = nomina;

        // Calcular Costo manufactura mensual y por hora
        const manuMonth = (average * nomina).toFixed(2);
        manuMonthCell.textContent = manuMonth;
        const manuHour = (manuMonth / hoursLab).toFixed(2);
        manuHourCell.textContent = manuHour;

        // Calcular horas
        const hourEsc = (parseFloat(salaryXHour) + parseFloat(manuHour)).toFixed(2);
        hourEscCell.textContent = hourEsc;
        const hourCli = (hourEsc * 2).toFixed(2);
        hourCliCell.textContent = hourCli;
        const hourCap = ((hourEsc * 3) + parseFloat(hourCli)).toFixed(2);
        hourCapCell.textContent = hourCap;

        // Calcular precios
        const priceEsc = (hourEsc / (1 - margin)).toFixed(2);
        priceEscCell.textContent = priceEsc;
        priceIvaEscCell.textContent = (priceEsc * 1.16).toFixed(2);

        const priceCli = (hourCli / (1 - margin)).toFixed(2);
        priceCliCell.textContent = priceCli;
        priceIvaCliCell.textContent = (priceCli * 1.16).toFixed(2);

        const priceCap = (hourCap / (1 - margin)).toFixed(2);
        priceCapCell.textContent = priceCap;
        priceIvaCapCell.textContent = (priceCap * 1.16).toFixed(2);
    }

    function updateTotalSalary() {
        let totalSalary = 0;
        const salaryCells = document.querySelectorAll('.td_salary');
        salaryCells.forEach(cell => {
            totalSalary += parseFloat(cell.textContent) || 0;
        });
        console.log("Total Salary:", totalSalary); // Verificar el cálculo
        totalSalaryCell.textContent = totalSalary.toFixed(2); // Mostrar el total con dos decimales
    }
    

    function updateAllRows() {
        const rows = tableBodyCharges.querySelectorAll('tr');
        rows.forEach(calculateRow);
        updateTotalSalary(); // Actualizar el total después de calcular todas las filas
    }

    function addRowCharges() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="td_charge">Nuevo Cargo</td>
            <td class="td_salary" contenteditable="true">0</td>
            <td class="td_salary_x_hour"></td>
            <td class="td_nomina"></td>
            <td class="td_manu_month"><b></b></td>
            <td class="td_manu_hour"></td>
            <td class="td_margin" contenteditable="true">0%</td>
            <td class="td_hour_esc"></td>
            <td class="td_hour_cli"></td>
            <td class="td_hour_cap"></td>
            <td class="td_price_esc"></td>
            <td class="td_price_iva esc"></td>
            <td class="td_price_cli"></td>
            <td class="td_price_iva cli"></td>
            <td class="td_price_cap"></td>
            <td class="td_price_iva cap"></td>
        `;
        const totalRow = tableBodyCharges.querySelector('tr:last-child');
        tableBodyCharges.insertBefore(newRow, totalRow); // Insertar nueva fila antes de la fila de total
        assignEditableEvent(newRow.querySelectorAll('[contenteditable="true"]'));
        updateAllRows();
    }

    function assignEditableEvent(cells = []) {
        cells.forEach(cell => {
            cell.addEventListener('input', function () {
                if (cell.classList.contains('td_salary') || cell.classList.contains('td_margin') || cell === averageCell || cell === hoursLabCell) {
                    updateHourCells();
                    updateAllRows();
                }
            });
        });
    }

    btnAddRow.addEventListener('click', addRowCharges);
    assignEditableEvent(document.querySelectorAll('[contenteditable="true"]'));
    updateHourCells();
});
