import { setupUniver } from './components/setup-univer.js';

function main() {
    const univerAPI = setupUniver()
    window.univerAPI = univerAPI
}

main()
univerAPI.onCommandExecuted((command) => {
    // console.log(command);
    if(command.id === 'sheet.mutation.set-range-values' || command.id === 'sheet.mutation.add-worksheet-merge'){
        // console.log(command);
        if ((command.params.trigger)) {
            // console.log(command);
            updateDataInLaravel();
        }
    }


    if(command.id === 'sheet.operation.set-selections' && command.params.subUnitId === "Rnhp3bSJ-yZxQ5QyZT8LV" && command.params.type == 0) {
        if (command.params.selections[0]["primary"]["actualRow"] == 0 && command.params.selections[0]["primary"]["actualColumn"] == 0) {
            // console.log(command.params.selections[0]);

            const activeWorkbook = univerAPI.getActiveWorkbook()
            if (!activeWorkbook)
                throw new Error('activeWorkbook is not defined')

            const snapshot = activeWorkbook.getSnapshot()

            const sheet4 = activeWorkbook.getSheetByName("Sheet4");

            const range = sheet4.getRange(0, 1, 1, 1);
            const value = range.getValue();

            searchByDate(value);
            setRangeTable();
        }

        if (command.params.selections[0]["primary"]["actualColumn"] == 11) {
            console.log("pogruzka");
            sendPogruz(command.params.selections[0]["primary"]["actualRow"]);
        }

        if (command.params.selections[0]["primary"]["actualColumn"] == 12) {
            console.log("razgruzka");
            sendRazgruz(command.params.selections[0]["primary"]["actualRow"]);
        }
    }
})

function sendPogruz(row) {
    const activeWorkbook = univerAPI.getActiveWorkbook()
    if (!activeWorkbook)
        throw new Error('activeWorkbook is not defined')

    const snapshot = activeWorkbook.getSnapshot()

    const sheet4 = activeWorkbook.getSheetByName("Sheet4");

    let tableData = JSON.parse(localStorage.getItem("tableData"));

    const range = sheet4.getRange(row + 1, 0, 15, 13);

    let values = range.getValues();

    const suppliersToSend = [];

    for (const arr of values) {
        if (arr.every(item => item === null)) {
            break;
        }
        suppliersToSend.push({
            code: arr[2],
            carModel: arr[3],
            carNumber: arr[4],
            trailerModel: arr[5],
            trailerNumber: arr[6],
            tons: '',
            driver: arr[8],
            phone: arr[9],
            payer: arr[10]
        });
    }

    // console.log(suppliersToSend);


    // let supplier = range.getValue();

    // console.log(supplier);

    // let groupedData = JSON.parse(localStorage.getItem("groupedData"));
    //
    // const filteredData = groupedData.filter(item => item.supplierName === supplier);
    //
    // const suppliersToSend = filteredData.map(item => ({
    //     code: item.code,
    //     carModel: item.carModel,
    //     carNumber: item.carNumber,
    //     trailerModel: item.trailerModel || null,
    //     trailerNumber: item.trailerNumber || null,
    //     tons: item.tons || null,
    //     driver: item.driver,
    //     phone: item.phone,
    //     payer: item.payer || null
    // }));
    //
    // console.log(suppliersToSend);

    // // Отправка данных на сервер
    // fetch('/suppliers', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // В Laravel нужен CSRF токен
    //     },
    //     body: JSON.stringify({ suppliers: suppliersToSend }),
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('Успех:', data);
    //     })
    //     .catch((error) => {
    //         console.error('Ошибка:', error);
    //     });

    let searchdate = localStorage.getItem("searchdate");

    const date = parseDateString(searchdate);

    let subject = "Погрузка на " + formatDateToString(date);

    sendEmail(suppliersToSend, subject);
}

async function sendEmail(suppliersToSend, subject) {

    // Данные для черновика
    const tableHtml = createTableHtml(suppliersToSend);

    const draftData = {
        to: 'gg-gg13@bk.ru',
        subject: subject,
        htmlTable: tableHtml,
        message: 'С уважением',
        from: 'gg-gg13@bk.ru'
    };


    fetch('/imap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // В Laravel нужен CSRF токен
        },
        body: JSON.stringify(draftData) // Преобразуем объект в JSON
    })
        .then(response => response.json())
        .then(data => {
            console.log('Успех:', data.message);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

}

// Функция для создания HTML-кода таблицы
function createTableHtml(suppliers) {
    let tableHtml = `
        <table cellpadding='6' border='1' style='border-collapse:collapse'>
            <thead>
                <tr>
                    <th>КОД</th>
                    <th>Марка а/м</th>
                    <th>Гос. номер а/м</th>
                    <th>Прицеп</th>
                    <th>Гос. номер прицепа</th>
                    <th>Тонн</th>
                    <th>Водитель</th>
                    <th>Телефон</th>
                    <th>ПЛАТЕЛЬЩИК</th>
                </tr>
            </thead>
            <tbody>`;

    suppliers.forEach(supplier => {
        tableHtml += `
                <tr>
                    <td>${supplier.code}</td>
                    <td>${supplier.carModel}</td>
                    <td>${supplier.carNumber}</td>
                    <td>${supplier.trailerModel}</td>
                    <td>${supplier.trailerNumber}</td>
                    <td>${supplier.tons}</td>
                    <td>${supplier.driver}</td>
                    <td>${supplier.phone}</td>
                    <td>${supplier.payer}</td>
                </tr>`;
    });

    tableHtml += `
            </tbody>
        </table>
        <p>С уважением ...</p>`;

    return tableHtml;
}

function sendRazgruz(row) {
    const activeWorkbook = univerAPI.getActiveWorkbook()
    if (!activeWorkbook)
        throw new Error('activeWorkbook is not defined')

    const snapshot = activeWorkbook.getSnapshot()

    const sheet4 = activeWorkbook.getSheetByName("Sheet4");

    let tableData = JSON.parse(localStorage.getItem("tableData"));

    const range = sheet4.getRange(row, 0, 1, 13);

    let values = range.getValues();

    const suppliersToSend = [];

    for (const arr of values) {
        if (arr.every(item => item === null)) {
            break;
        }
        suppliersToSend.push({
            code: arr[2],
            carModel: arr[3],
            carNumber: arr[4],
            trailerModel: arr[5],
            trailerNumber: arr[6],
            tons: '',
            driver: arr[8],
            phone: arr[9],
            payer: arr[10]
        });
    }

    let searchdate = localStorage.getItem("searchdate");

    const date = parseDateString(searchdate);

    // Создание даты на следующий день
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    let subject = "Разгрузка на " + formatDateToString(date) + " - " + formatDateToString(nextDay);

    sendEmail(suppliersToSend, subject);
}

function parseDateString(dateString) {
    // Разделение строки на день и месяц
    const [day, month] = dateString.split('.').map(part => part.trim());

    // Текущий год
    const currentYear = new Date().getFullYear();

    // Создание объекта даты
    const date = new Date(currentYear, month - 1, day);

    return date;
}

function formatDateToString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


function setRangeTable() {
    const activeWorkbook = univerAPI.getActiveWorkbook()
    if (!activeWorkbook)
        throw new Error('activeWorkbook is not defined')

    const snapshot = activeWorkbook.getSnapshot()

    const sheet4 = activeWorkbook.getSheetByName("Sheet4");

    let tableData = JSON.parse(localStorage.getItem("tableData"));

    console.log(tableData);

    const range = sheet4.getRange(1, 0, 150, 13);
    // range.setValues(0);
    range.setValue({v: null, s: null});
    range.setValues(tableData);

    // const sheet5 = activeWorkbook.getSheetByName("Sheet5");
    //
    // let templateRange = sheet5.getRange(0, 0, 6, 12);
    // let templateStyle = templateRange.getCellStyleData();
    // console.log(templateStyle);
    // console.log(templateRange.getValues());
    // range.setValues(templateRange.getValues());
}

function searchByDate(date) {
    // const searchDate = "6. 08";
    const searchDate = normalizeDate(date).toString();

    localStorage.setItem("searchdate", searchDate);
    // console.log(searchDate === "6. 08", typeof(searchDate));
    // console.log(searchDate);

    let data = JSON.parse(localStorage.getItem("cellData"));

// Флаг для проверки, найдена ли дата
    let dateFound = false;
    let groupedData = [];

    let foundData = [];
// Проходим по всем строкам и столбцам
    for (const rowKey in data) {
        const rowValue = data[rowKey];
        for (const colKey in rowValue) {
            // console.log(colKey);
            const colValue = rowValue[colKey];
            // Проверяем, есть ли значение и содержит ли оно искомую дату
            if (colValue.v && typeof colValue.v === 'string' && colValue.v.trim() !== "") {
                // console.log(colValue.v, colValue.v.includes(searchDate));
                if (colValue.v.includes(searchDate)) {
                    for (let i = parseInt(rowKey); i <= parseInt(rowKey) + 20; i+=2)
                    {
                        const info = getInfo(i, colKey);
                        const transParts = info.trans.split(' ').map(part => part.trim()); // Разделяем и обрезаем пробелы
                        const transKey = transParts[0]; // Основное значение trans
                        const dopValue = transParts.slice(1).join(' '); // Дополнительное слово

                    //     console.log(info,(
                    //         (info.vod !== "" && info.vod !== null) ||
                    //         (info.nomer !== "" && info.nomer !== null) ||
                    //         (info.trans !== "" && info.trans !== null) ||
                    //         (info.info !== "" && info.info !== null)
                    // ));

                        // Добавляем поле dop в объект info
                        info.dop = dopValue.trim() || null; // Если дополнительное слово пустое, устанавливаем в null

                        info.payeer = getPayeer(info, transKey);

                        if (
                            (info.vod !== "" && info.vod !== null) ||
                            (info.nomer !== "" && info.nomer !== null) ||
                            (info.trans !== "" && info.trans !== null) ||
                            (info.info !== "" && info.info !== null)
                        )
                        {
                            // Если ключ trans еще не существует в groupedData, создаем новый массив
                            if (!groupedData[transKey]) {
                                groupedData[transKey] = [];
                            }

                            // Добавляем информацию в соответствующий массив
                            groupedData[transKey].push(info);
                        }
                    }
                    console.log(`Дата '${searchDate}' найдена в строке ${rowKey}, столбце ${colKey}: ${colValue.v}`);
                    dateFound = true;
                    // console.log(foundData);
                }
            }
        }
    }

    console.log(groupedData);


// fetchData();

// Если дата не найдена
    if (!dateFound) {
        console.log(`Дата '${searchDate}' не найдена в таблице.`);
    }

    transormData(groupedData);

}

function getPayeer(info, transKey) {
    let payeer = null;

    switch(transKey) {
        case 'АКР':
            switch (info.dop) {
                case 'инерт':
                    payeer = "ООО Инерт СТ";
                    break;
                case 'перев':
                    if (info.info.toLowerCase().includes("крио")) {
                        payeer = "ООО Криопродукт";
                    }

                    if (info.info.toLowerCase().includes("техносвар")) {
                        payeer = "ООО Техносвар";
                    }
                    break;
            }
            break;
        case 'ДРГБ':
        case 'ДРГ':
            switch (info.dop) {
                case 'инерт':
                    payeer = "ООО Инерт СТ";
                    break;
                case 'перев':
                    if (info.info.toLowerCase().includes("айс")) {
                        payeer = "ООО Айс Лайн";
                    }

                    if (info.info.toLowerCase().includes("ликид")) {
                        payeer = "ООО Эр Ликид";
                    }
                    break;
                default:
                    payeer = "ООО Инерт СТ";
                    break;
            }
            break;
        case 'НМСК':
        case 'ПСК':
        case 'МГС':
        case 'МДЛ':
            payeer = "ООО Инерт СТ";
            break;
    }

    return payeer;
    // let payeers = JSON.parse(localStorage.getItem("payeers"));
    //
    // console.log(payeers);

    // for (const row of Object.values(payeers)) {
    //     if (row[0]) {
    //         const driverShortName = normalizeString(row[0].v); // Нормализуем сокращенное имя водителя
    //         const driverFullName = row[1].v; // Полное имя водителя
    //         const driverPhone = row[3] ? row[3].v : null; // Телефон водителя (если существует)
    //         // Проверяем, содержит ли сокращенное имя водителя хотя бы одно слово из shortName
    //         const anyWordMatch = shortNameWords.some(word => driverShortName.includes(word));
    //
    //         if (anyWordMatch) {
    //             return { fullName: driverFullName, phone: driverPhone }; // Возвращаем полное имя и телефон
    //         }
    //     }
    // }
    // return { fullName: shortName, phone: null }; // Если не найдено

    console.log(info);
}

function transormData(groupedData) {
    const tableData = [];

// Проходим по каждому поставщику в groupedData
    for (const supplier in groupedData) {
        const records = groupedData[supplier];

        // Проходим по каждой записи для данного поставщика
        records.forEach(record => {
            // Создаем объект для строки таблицы
            const tableRow = {
                supplierName: supplier, // Название поставщика
                dop: record.dop,
                code: record.nomer, // Код
                // info: record.info, // Марка а/м
                carNumber: record.carInfo.number, // Гос. номер а/м
                carModel: record.carInfo.model, // Гос. номер а/м
                trailerModel: record.carInfo.trailerModel, // Прицеп (если есть, добавьте логику)
                trailerNumber: record.carInfo.trailerNumber, // Гос. номер прицепа (если есть, добавьте логику)
                tons: null, // Тонн (если есть, добавьте логику)
                driver: record.fullName, // Водитель
                phone: record.phone, // Телефон
                payeer: record.payeer // ПЛАТЕЛЬЩИК (если есть, добавьте логику)
            };

            // Добавляем строку в массив таблицы
            tableData.push(tableRow);
        });
    }

    console.log(tableData);

    const transformedData = {};
    let index = 2;

    let previousSupplierName = tableData[0].supplierName;

    let style = {
        "bd": {
            "b": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            },
            "l": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            },
            "r": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            },
            "t": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            }
        },
        "bg": null,
        "bl": 0,
        "cl": {
            "rgb": "rgb(0,0,0)"
        },
        "ff": "Times New Roman",
        "fs": 12,
        "ht": 2,
        "it": 0,
        "ol": {
            "s": 0,
            "cl": {
                "rgb": "rgb(0,0,0)"
            }
        },
        "pd": {
            "b": 5,
            "l": 2,
            "r": 2,
            "t": 5
        },
        "st": {
            "s": 0,
            "cl": {
                "rgb": "rgb(0,0,0)"
            }
        },
        "tb": 3,
        "td": 0,
        "tr": {
            "a": 0,
            "v": 0
        },
        "ul": {
            "s": 0,
            "cl": {
                "rgb": "rgb(0,0,0)"
            }
        },
        "vt": 3
    };

    let yellowBgStyle = {
        "bd": {
            "b": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            },
            "l": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            },
            "r": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            },
            "t": {
                "s": 1,
                "cl": {
                    "rgb": "windowtext"
                }
            }
        },
        "bg": {
            "rgb": "rgb(255,255,0)"
        },
        "bl": 0,
        "cl": {
            "rgb": "rgb(0,0,0)"
        },
        "ff": "Times New Roman",
        "fs": 12,
        "ht": 2,
        "it": 0,
        "ol": {
            "s": 0,
            "cl": {
                "rgb": "rgb(0,0,0)"
            }
        },
        "pd": {
            "b": 2,
            "l": 2,
            "r": 2,
            "t": 15
        },
        "st": {
            "s": 0,
            "cl": {
                "rgb": "rgb(0,0,0)"
            }
        },
        "tb": 3,
        "td": 0,
        "tr": {
            "a": 0,
            "v": 0
        },
        "ul": {
            "s": 0,
            "cl": {
                "rgb": "rgb(0,0,0)"
            }
        },
        "vt": 3
    };


    let firstStr = {
        0: {s: style },
        1: {v: "доп.", s: style },
        2: { v: "КОД", s: yellowBgStyle },
        3: { v: "марка а/м", s: style },
        4: { v: "гос. номер а/м", s: style },
        5: { v: "прицеп", s: style },
        6: { v: "гос. номер прицепа", s: style },
        7: { v: "тонн", s: style },
        8: { v: "водитель", s: style },
        9: { v: "телефон", s: style },
        10: { v: "ПЛАТЕЛЬЩИК", s: style },
        11: { v: "кнопка сформировать черновик и подвесить в  электронной почте", s: style },
        12: { s: style }
    };

    transformedData[1] = firstStr;

    tableData.forEach((row) => {
        if (row.supplierName !== previousSupplierName && index !== 2) {
            index += 3;
            previousSupplierName = row.supplierName;
            transformedData[index] = firstStr;
            index++
        }

        transformedData[index] = {
            0: { v: row.supplierName, s: style },
            1: { v: row.dop, s: style },
            2: { v: row.code, s: style },
            3: { v: row.carModel, s: style },
            4: { v: row.carNumber, s: style },
            5: { v: row.trailerModel, s: style },
            6: { v: row.trailerNumber, s: style },
            7: { v: row.tons, s: style },
            8: { v: row.driver, s: style },
            9: { v: row.phone, s: style },
            10: { v: row.payeer, s: style },
            11: {s: style },
            12: {v: "для разгрузки", s: style },
        };
        index++;
    });


    console.log(transformedData);


    // Сохраняем данные в localStorage
    localStorage.setItem('tableData', JSON.stringify(transformedData));
    localStorage.setItem('groupedData', JSON.stringify(tableData));
}

function getInfo(rowKey, colKey) {
    rowKey = parseInt(rowKey);
    colKey = parseInt(colKey);

    let trans = getCellData(rowKey + 1, colKey);
    let info = getCellData(rowKey + 1, colKey + 1);
    let nomer = getCellData(rowKey + 1, colKey + 2);
    let vod = getCellData(rowKey + 2, colKey + 2);

    // Применяем trim только если значение является строкой
    trans = typeof trans === 'string' ? trans.trim() : trans;
    info = typeof info === 'string' ? info.trim() : info;
    nomer = typeof nomer === 'string' ? nomer.trim() : nomer;
    vod = typeof vod === 'string' ? vod.trim() : vod;

    let {fullName, phone} = getFullDriverName(vod);

    let carInfo = getCarInfo(nomer);

    return {
        trans,
        info,
        nomer,
        vod,
        fullName,
        rowKey,
        colKey,
        carInfo,
        phone
    }
}

function normalizeString(str) {
    return str.toString().replace(/ё/g, 'е').toLowerCase().trim(); // Заменяем ё на е и приводим к нижнему регистру
}

function normalizeDate(dateStr) {
    return dateStr.replace(/^0+/, '');
}

function getFullDriverName(shortName) {
    let driverData = JSON.parse(localStorage.getItem("drivers"));

    // Применяем trim к сокращенному имени и разбиваем на слова
    shortName = normalizeString(shortName);
    const shortNameWords = shortName.split(/\s+/).filter(word => word !== ''); //

    for (const row of Object.values(driverData)) {
        if (row[0]) {
            const driverShortName = normalizeString(row[0].v); // Нормализуем сокращенное имя водителя
            const driverFullName = row[1].v; // Полное имя водителя
            const driverPhone = row[3] ? row[3].v : null; // Телефон водителя (если существует)
            // Проверяем, содержит ли сокращенное имя водителя хотя бы одно слово из shortName
            const anyWordMatch = shortNameWords.some(word => driverShortName.includes(word));

            if (anyWordMatch) {
                return { fullName: driverFullName, phone: driverPhone }; // Возвращаем полное имя и телефон
            }
        }
    }
    return { fullName: shortName, phone: null }; // Если не найдено
}

function getCarInfo(carCode) {
    let spisok = JSON.parse(localStorage.getItem("spisok"));
    for (const row of Object.values(spisok)) {
        if (row[0]) {
            const code = row[0].v; // Нормализуем код автомобиля
            if (code === carCode) {
                return {
                    model: row[1].v, // Модель авто
                    number: row[2].v, // Номер авто
                    trailerNumber: row[3] ? row[3].v : null, // Номер прицепа
                    trailerModel: row[4] ? row[4].v : null // Модель прицепа
                };
            }
        }
    }
    return { model: null, number: null, trailerNumber: null, trailerModel: null }; // Если не найдено
}

function getCellData(rowKey, colKey) {
    let data = JSON.parse(localStorage.getItem("cellData"));

    if (data[rowKey] && data[rowKey][colKey]) {
        return data[rowKey][colKey]["v"];
    }
}

function updateDataInLaravel() {

    const activeWorkbook = univerAPI.getActiveWorkbook();
    const snapshot = activeWorkbook.save()

    fetch(`/schedules/${snapshot.id}`, {
        method: 'POST', // Используем метод PUT для обновления данных
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // В Laravel нужен CSRF токен
        },
        body: JSON.stringify({
            unit_id: snapshot.id,
            snapshot: JSON.stringify(snapshot)
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data updated successfully:', data);
        })
        .catch(error => {
            console.error('Error updating data:', error);
        });
}
