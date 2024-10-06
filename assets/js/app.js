document.addEventListener('DOMContentLoaded', () => {
    const btnAddRow = document.getElementById('add_row_charges');
    const tableBodyCharges = document.getElementById('table_body_charges');
    const totalSalaryCell = document.querySelector('.total');
    const averageCell = document.querySelector('.average');
    const selectCharges = document.getElementById('select_charges');

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

        // Cálculos no IVA y con IVA para esc, cli y cap
        const hoursEsc = parseFloat(document.querySelector('.hours_esc').textContent) || 0;
        const hoursCli = parseFloat(document.querySelector('.hours_cli').textContent) || 0;
        const hoursCap = parseFloat(document.querySelector('.hours_cap').textContent) || 0;

        const noIvaEsc = hoursEsc * (priceEsc * 1.16);
        const noIvaCli = hoursCli * (priceCli * 1.16);
        const noIvaCap = hoursCap * (priceCap * 1.16);

        const ivaEsc = noIvaEsc * 1.16;
        const ivaCli = noIvaCli * 1.16;
        const ivaCap = noIvaCap * 1.16;

        // Cálculo Precio Total y descuento
        const totalPrice = ivaEsc + ivaCli + ivaCap;
        const priceDescountFive = totalPrice * 0.95;
        const priceDescountTen = totalPrice * 0.90;

        // Asignar valores a las celdas correspondientes
        document.querySelector('.no_iva_esc').textContent = formatterPesos.format(noIvaEsc);
        document.querySelector('.no_iva_cli').textContent = formatterPesos.format(noIvaCli);
        document.querySelector('.no_iva_cap').textContent = formatterPesos.format(noIvaCap);

        document.querySelector('.iva_esc').textContent = formatterPesos.format(ivaEsc);
        document.querySelector('.iva_cli').textContent = formatterPesos.format(ivaCli);
        document.querySelector('.iva_cap').textContent = formatterPesos.format(ivaCap);

        document.querySelector('.cost_total').textContent = formatterPesos.format(totalPrice);
        document.querySelector('.descount_ten').textContent = formatterPesos.format(priceDescountTen);
        document.querySelector('.descount_five').textContent = formatterPesos.format(priceDescountFive);

        document.querySelector('.hours_esc').textContent = hoursEsc;
        document.querySelector('.hours_cli').textContent = hoursCli;
        document.querySelector('.hours_cap').textContent = hoursCap;

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

    const updateTotalHoursEsc = () => {
        let totalHours = 0;
        document.querySelectorAll('.hours_total_esc').forEach(cell => {
            const hours = parseFloat(cell.textContent) || 0;
            totalHours += hours;
            cell.textContent = hours;
        });
        totalHoursEsc.textContent = totalHours;
        return totalHours;
    }

    const updateTotalHoursCli = () => {
        let totalHours = 0;
        document.querySelectorAll('.hours_total_cli').forEach(cell => {
            const hours = parseFloat(cell.textContent) || 0;
            totalHours += hours;
            cell.textContent = hours;
        });
        totalHoursCli.textContent = totalHours;
        return totalHours;
    }

    const updateTotalHoursCap = () => {
        let totalHours = 0;
        document.querySelectorAll('.hours_total_cap').forEach(cell => {
            const hours = parseFloat(cell.textContent) || 0;
            totalHours += hours;
            cell.textContent = hours;
        });
        totalHoursCap.textContent = totalHours;
        return totalHours;
    }

    const updateAllRows = () => {
        const rows = tableBodyCharges.querySelectorAll('tr');
        const totalSalary = updateTotalSalary();
        rows.forEach(row => calculateRow(row, totalSalary));
        updateSelectCharges(); // Actualiza el select después de calcular todas las filas
    };

    const loadJSONData = (data) => {
        data.forEach(item => {
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
        updateAllRows(); // Actualizar los cálculos después de cargar los datos
    };

    const fetchData = async (url, callback) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const jsonData = await response.json();
            callback(jsonData);
        } catch (error) {
            console.error("Error al recuperar datos", error);
        }
    }

    fetchData('/data/content.json', (jsonData) => {
        loadJSONData(jsonData.data);
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
            arrCharge.forEach(item => {
                let option = document.createElement('option');
                option.value = item.charge;
                option.textContent = item.charge;
                selectCharges.appendChild(option);
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

        const totalHrsEsc = Array.from(document.querySelectorAll('.hours_total_esc')).reduce((total, cell) => total + (cell.innerText || 0), 0);
        const totalHrsCap = Array.from(document.querySelectorAll('.hours_total_cap')).reduce((total, cell) => total + (cell.innerText || 0), 0);
        const totalHrsCli = Array.from(document.querySelectorAll('.hours_total_cli')).reduce((total, cell) => total + (cell.innerText || 0), 0);

        document.querySelector('.hours_total_esc').innerText = totalHrsEsc.toFixed(0);
        document.querySelector('.hours_total_cli').innerText = totalHrsCli.toFixed(0);
        document.querySelector('.hours_total_cap').innerText = totalHrsCap.toFixed(0);

        const totalPrice = Array.from(document.querySelectorAll('.cost_total')).reduce((total, cell) => total + (parseFloat(cell.innerText) || 0), 0);

        document.querySelector('.cost_total').innerText = formatterPesos.format(totalPrice);
        document.querySelector('.descount_ten').innerText = formatterPesos.format(totalPrice * 0.90);
        document.querySelector('.descount_five').innerText = formatterPesos.format(totalPrice * 0.95);
    };

    // Añade eventos de escucha
    btnAddRow.addEventListener('click', addRowCharges);
    assignEditableEvent(document.querySelectorAll('[contenteditable="true"]'));
    updateHourCells();
    updateSelectCharges();

    // Escuchar cambios en las celdas de horas
    document.querySelectorAll('.td_hours_esc, .td_hours_cli, .td_hours_cap, .hours_total_esc, .hours_total_cli, .hours_total_cap').forEach(cell => {
        cell.addEventListener('input', updateTotals);
    });
});