import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';


// import "@univerjs/design/lib/index.css";
// import "@univerjs/ui/lib/index.css";
// import "@univerjs/docs-ui/lib/index.css";
// import "@univerjs/sheets-ui/lib/index.css";
// import "@univerjs/sheets-formula/lib/index.css";

// import { LocaleType, Tools, Univer } from "@univerjs/core";
// import { defaultTheme } from "@univerjs/design";
//
// import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
// import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
//
// import { UniverUIPlugin } from "@univerjs/ui";
//
// import { UniverDocsPlugin } from "@univerjs/docs";
// import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
//
// import { UniverSheetsPlugin } from "@univerjs/sheets";
// import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
// import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
//
// import DesignEnUS from '@univerjs/design/locale/en-US';
// import UIEnUS from '@univerjs/ui/locale/en-US';
// import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';
// import SheetsEnUS from '@univerjs/sheets/locale/en-US';
// import SheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';
// import SheetsFormulaEnUS from '@univerjs/sheets-formula/locale/en-US';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
