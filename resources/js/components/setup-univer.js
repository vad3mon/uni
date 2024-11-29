import '../bootstrap';
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";
import '@univerjs/sheets-numfmt/lib/index.css';
import '@univerjs/find-replace/lib/index.css';

import '../../css/app.css';

import {LocaleType, Tools, Univer, UniverInstanceType} from "@univerjs/core";
import { defaultTheme, Dropdown } from "@univerjs/design";

import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";

import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";

import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import {UniverSheetsNumfmtPlugin} from "@univerjs/sheets-numfmt";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";

import { UniverUIPlugin } from "@univerjs/ui";

import { FUniver } from '@univerjs/facade'

// import DesignEnUS from '@univerjs/design/locale/en-US';
// import UIEnUS from '@univerjs/ui/locale/en-US';
// import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';
// import SheetsEnUS from '@univerjs/sheets/locale/en-US';
// import SheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';
// import SheetsFormulaEnUS from '@univerjs/sheets-formula/locale/en-US';

import DesignRU from '@univerjs/design/locale/ru-RU';
import UIRU from '@univerjs/ui/locale/ru-RU';
import DocsUIRU from '@univerjs/docs-ui/locale/ru-RU';
import SheetsRU from '@univerjs/sheets/locale/ru-RU';
import SheetsUIRU from '@univerjs/sheets-ui/locale/ru-RU';
import SheetsFormulaRU from '@univerjs/sheets-formula/locale/ru-RU';
import NumfmtRU from '@univerjs/sheets-numfmt/lib/locale/ru-RU';

// import { ruRU } from 'univer:locales'
// import { ruRU } from '@univerjs/vite-plugin/types'
import {UniverFindReplacePlugin} from "@univerjs/find-replace";
import {UniverSheetsFindReplacePlugin} from "@univerjs/sheets-find-replace";
import SheetsFindReplaceRU from '@univerjs/sheets-find-replace/locale/ru-RU';


export function setupUniver() {
    const univer = new Univer({
        theme: defaultTheme,
        locale: LocaleType.EN_US,
        locales:
            {

                [LocaleType.EN_US]: Tools.deepMerge(
                    SheetsRU,
                    DocsUIRU,
                    SheetsUIRU,
                    SheetsFormulaRU,
                    UIRU,
                    DesignRU,
                    NumfmtRU,
                    SheetsFindReplaceRU
                ),
            },
    });

    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);

    univer.registerPlugin(UniverUIPlugin, {
        container: 'univer',
        header: true,
        footer: true,
    });

    univer.registerPlugin(UniverDocsPlugin);
    univer.registerPlugin(UniverDocsUIPlugin);

    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);

    univer.registerPlugin(UniverFindReplacePlugin)
    univer.registerPlugin(UniverSheetsFindReplacePlugin)

    univer.registerPlugin(UniverSheetsNumfmtPlugin)

// Подключаем прослушивание событий изменения ячеек

    fetchGetWb(1, univer);

    return FUniver.newAPI(univer);
}
//
// document.addEventListener("DOMContentLoaded", function()
// {
//     fetchGetWb(1);
// });

async function fetchGetWb(unit_id, univer) {
    fetch(`/get/schedules/XSJ0hYXgSwWy2u24ql2sfw`, {
        method: 'POST', // Используем метод PUT для обновления данных
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // В Laravel нужен CSRF токен
        },
        body: JSON.stringify({
        })
    })
        .then(response => response.json())
        .then(data => {
            let snapshot = JSON.parse(data.wb.snapshot);
            console.log(snapshot);
            univer.createUnit(UniverInstanceType.UNIVER_SHEET, snapshot);


            const sheet1 = Object.values(snapshot.sheets).find((sheet) => {
                return sheet.name === 'Sheet1'
            })

            const sheet2 = Object.values(snapshot.sheets).find((sheet) => {
                return sheet.name === 'Sheet2'
            })

            const sheet3 = Object.values(snapshot.sheets).find((sheet) => {
                return sheet.name === 'Sheet3'
            })

            const sheet6 = Object.values(snapshot.sheets).find((sheet) => {
                return sheet.name === 'Sheet6'
            })

            if (!sheet1)
                throw new Error('sheet1 is not defined')

            // eslint-disable-next-line no-alert
            // alert(JSON.stringify(sheet1, null, 2))
            // eslint-disable-next-line no-console
            // console.log(JSON.stringify(sheet1, null, 2))

            // console.log(JSON.stringify(sheet1));
            // console.log(JSON.stringify(snapshot));

            localStorage.setItem('cellData', JSON.stringify(sheet1['cellData'], null, 2));
            localStorage.setItem('drivers', JSON.stringify(sheet3['cellData'], null, 2));
            localStorage.setItem('spisok', JSON.stringify(sheet2['cellData'], null, 2));
            localStorage.setItem('payeers', JSON.stringify(sheet6['cellData'], null, 2));
        })
        .catch(error => {
            console.error('Error updating data:', error);
        });
}
