document.addEventListener('DOMContentLoaded', () => {
    const btnAddRow = document.getElementById('add_row_charges');
    const tableBodyCharges = document.getElementById('table_body_charges');
    const totalSalaryCell = document.querySelector('.total');
    const totalHoursEscCell = document.querySelector('.hours_total_esc');
    const totalHoursCapCell = document.querySelector('.hours_total_cli');
    const totalHoursCliCell = document.querySelector('.hours_total_cap');
    const averageCell = document.querySelector('.average');
    const selectCharges = document.getElementById('select_charges');
    let precioSeleccionado = 0;
    let hoursLabFromJSON = 0;

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
        //! Cálculos primer tabla
        const salaryCell = row.querySelector('.td_salary');
        const salary = parseFloat(salaryCell.textContent) || 0;
        const average = parseFloat(averageCell.textContent) || 0;
        const hoursLab = parseFloat(hoursCells.lab.textContent) || 0;
        const margin = parseFloat(row.querySelector('.td_margin').textContent.replace('%', '').trim()) / 100;

        const salaryXHour = salary / hoursLab;
        row.querySelector('.td_salary_x_hour').textContent = formatterPesos.format(salaryXHour);

        const nomina = ((salary / totalSalary) * 100).toFixed(1);
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

        //! Cálculos para la tabla 2
        const hoursEsc = parseFloat(document.querySelector('.hours_esc').textContent) || 0;
        const hoursCli = parseFloat(document.querySelector('.hours_cli').textContent) || 0;
        const hoursCap = parseFloat(document.querySelector('.hours_cap').textContent) || 0;

        const noIvaEsc = hoursEsc * precioSeleccionado;
        const noIvaCli = hoursCli * precioSeleccionado;
        const noIvaCap = hoursCap * precioSeleccionado;

        const ivaEsc = noIvaEsc * 1.16;
        const ivaCli = noIvaCli * 1.16;
        const ivaCap = noIvaCap * 1.16;

        document.querySelector('.hours_esc').textContent = hoursEsc;
        document.querySelector('.hours_cli').textContent = hoursCli;
        document.querySelector('.hours_cap').textContent = hoursCap;

        document.querySelector('.no_iva_esc').textContent = formatterPesos.format(noIvaEsc);
        document.querySelector('.no_iva_cli').textContent = formatterPesos.format(noIvaCli);
        document.querySelector('.no_iva_cap').textContent = formatterPesos.format(noIvaCap);

        document.querySelector('.iva_esc').textContent = formatterPesos.format(ivaEsc);
        document.querySelector('.iva_cli').textContent = formatterPesos.format(ivaCli);
        document.querySelector('.iva_cap').textContent = formatterPesos.format(ivaCap);

        //! Cálculo para la tabla 3 y 4
        const totalPrice = ivaEsc + ivaCli + ivaCap;
        const priceDescountFive = totalPrice * 0.95;
        const priceDescountTen = totalPrice * 0.90;

        document.querySelector('.cost_total').textContent = formatterPesos.format(totalPrice);
        document.querySelector('.descount_ten').textContent = formatterPesos.format(priceDescountTen);
        document.querySelector('.descount_five').textContent = formatterPesos.format(priceDescountFive);


        document.querySelector('.descount_ten_one').textContent = formatterPesos.format(priceDescountTen / 1);
        document.querySelector('.descount_ten_two').textContent = formatterPesos.format(priceDescountTen / 2);
        document.querySelector('.descount_ten_three').textContent = formatterPesos.format(priceDescountTen / 3);
        document.querySelector('.descount_ten_four').textContent = formatterPesos.format(priceDescountTen / 4);
        document.querySelector('.descount_ten_five').textContent = formatterPesos.format(priceDescountTen / 5);
        document.querySelector('.descount_ten_six').textContent = formatterPesos.format(priceDescountTen / 6);

        document.querySelector('.descount_five_one').textContent = formatterPesos.format(priceDescountFive / 1);
        document.querySelector('.descount_five_two').textContent = formatterPesos.format(priceDescountFive / 2);
        document.querySelector('.descount_five_three').textContent = formatterPesos.format(priceDescountFive / 3);
        document.querySelector('.descount_five_four').textContent = formatterPesos.format(priceDescountFive / 4);
        document.querySelector('.descount_five_five').textContent = formatterPesos.format(priceDescountFive / 5);
        document.querySelector('.descount_five_six').textContent = formatterPesos.format(priceDescountFive / 6);

        document.querySelector('.no_descount_one').textContent = formatterPesos.format(totalPrice / 1);
        document.querySelector('.no_descount_two').textContent = formatterPesos.format(totalPrice / 2);
        document.querySelector('.no_descount_three').textContent = formatterPesos.format(totalPrice / 3);
        document.querySelector('.no_descount_four').textContent = formatterPesos.format(totalPrice / 4);
        document.querySelector('.no_descount_five').textContent = formatterPesos.format(totalPrice / 5);
        document.querySelector('.no_descount_six').textContent = formatterPesos.format(totalPrice / 6);
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
        updateSelectCharges();
    };

    const loadJSONData = (data, horas) => {
        const tableBodyCharges = document.getElementById('table_body_charges');
        const firstRow = tableBodyCharges.querySelector('tr:first-child');
        if (firstRow && !firstRow.querySelector('.td_charge').textContent.trim()) {
            firstRow.remove();
        }

        data.forEach(item => {
            if (!item.charge || item.salary <= 0) {
                return;
            }
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="td_charge" contentEditable="true">${item.charge}</td>
                <td class="td_salary" contenteditable="true">${item.salary}</td>
                <td class="td_salary_x_hour"></td>
                <td class="td_nomina"></td>
                <td class="td_manu_month"><b></b></td>
                <td class="td_manu_hour"></td>
                <td class="td_margin" contenteditable="true">${item.margin}%</td>
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
        });

        // Update the hoursLab cell
        const hoursLab = horas.hour; // Get the hour value from jsonData.horas
        hoursCells.lab.textContent = hoursLab; // Set the hours_lab element's text content

        updateAllRows();
        updateHourCells(); // Call updateHourCells after updating hoursLab
    };

    const fetchData = async (url, callback) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const jsonData = await response.json();
            console.log(jsonData.horas); // Log the hours data
            callback(jsonData);
        } catch (error) {
            console.error("Error al recuperar datos", error);
        }
    };

    fetchData('/data/content.json', (jsonData) => {
        loadJSONData(jsonData.data, jsonData.horas);
    });

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

    document.getElementById('btn_add_charge').addEventListener('click', function () {
        var originalDiv = document.getElementById('container_hours_dedicated');
        var newDiv = originalDiv.cloneNode(true);

        var editableCells = newDiv.querySelectorAll('[contenteditable="true"]');
        editableCells.forEach(function (cell) {
            cell.textContent = '';
        });
        document.getElementById('container_hours_dedicated').appendChild(newDiv);
    });

    function updateSelectCharges() {
        selectCharges.innerHTML = '<option value="">Selecciona el cargo</option>';
        fetchData('/data/content.json', (jsonData) => {
            let arrCharge = jsonData.data;
            let preciosConIVA = {};
            const hoursLab = parseFloat(hoursCells.lab.textContent) || 174;
            arrCharge.forEach(item => {
                let option = document.createElement('option');
                option.value = item.charge;
                option.textContent = item.charge;
                selectCharges.appendChild(option);
                const costoMensual = item.salary;
                const costoPorHora = costoMensual / 174;
                const precio = costoPorHora * 13.79;
                const precioConIVA = precio * 1.16;
                preciosConIVA[item.charge] = precioConIVA.toFixed(2);
            });
            selectCharges.addEventListener('change', function () {
                const cargoSeleccionado = this.value;
                precioSeleccionado = parseFloat(preciosConIVA[cargoSeleccionado]) || 0;

                console.log(`Precio + IVA: $${precioSeleccionado.toFixed(2)}`);
            });
        });
    }

    const assignEditableEvent = (cells = []) => {
        cells.forEach(cell => {
            cell.addEventListener('input', () => {
                if (['td_salary', 'td_margin'].some(className => cell.classList.contains(className)) || cell === averageCell || cell === hoursCells.lab) {
                    updateHourCells();
                    updateAllRows();
                }
                if (cell.classList.contains('td_charge')) {
                    console.log('Cambio en td_charge:', cell.innerText.trim());
                    updateSelectCharges();
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

        const totalHrsEsc = Array.from(document.querySelectorAll('.hours_esc')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);
        const totalHrsCap = Array.from(document.querySelectorAll('.hours_cap')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);
        const totalHrsCli = Array.from(document.querySelectorAll('.hours_cli')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);

        document.querySelector('.hours_total_esc').innerText = totalHrsEsc.toFixed(0);
        document.querySelector('.hours_total_cli').innerText = totalHrsCli.toFixed(0);
        document.querySelector('.hours_total_cap').innerText = totalHrsCap.toFixed(0);

        const totalPrice = Array.from(document.querySelectorAll('.cost_total')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);

        document.querySelector('.cost_total').innerText = formatterPesos.format(totalPrice);
        document.querySelector('.descount_ten').innerText = formatterPesos.format(totalPrice * 0.90);
        document.querySelector('.descount_five').innerText = formatterPesos.format(totalPrice * 0.95);
    };

    btnAddRow.addEventListener('click', addRowCharges);
    assignEditableEvent(document.querySelectorAll('[contenteditable="true"]'));
    updateHourCells();
    updateSelectCharges();

    document.querySelectorAll('.td_hours_esc, .td_hours_cli, .td_hours_cap, .hours_total_esc, .hours_total_cli, .hours_total_cap').forEach(cell => {
        cell.addEventListener('input', updateTotals);
    });
});