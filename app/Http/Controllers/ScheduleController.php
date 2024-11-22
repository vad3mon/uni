<?php

namespace App\Http\Controllers;

use App\Models\CellData;
use App\Models\Workbook;
use Illuminate\Http\Request;
use App\Mail\SupplierMail;
use Illuminate\Support\Facades\Mail;

class ScheduleController extends Controller
{
    public function getData(Request $request, $id) {
//        $cells = CellData::query()->where('sheet', $name)->get();

        $wb = Workbook::query()->where('unit_id', $id)->first();

        return response()->json(
            [
                'wb' => $wb,
//                'cells' => $cells,
            ]
        );
    }

    public function update(Request $request, $id)
    {
//        $schedule = CellData::query()->createOrFirst(['sheet' => $name]);
//        $a = [];
//
//        foreach ($request['cellData'] as $index => $row) {
//            foreach ($row as $indexColumn => $column) {
//                if (isset($column['v'])) {
//                    $a[] = ['row' => $index, 'column' => $indexColumn, 'value' => $column['v']];
//                    CellData::query()->updateOrCreate(
//                        [
//                            'sheet' => $name,
//                            'row' => $index,
//                            'column' => $indexColumn,
//                        ],
//                        [
//                            'value' => $column['v'],
//                        ]
//                    );
//                }
//            }
//        }

        $w = Workbook::query()->updateOrCreate(
            [
                'unit_id' => $id,
            ],
            [
                'snapshot' => $request['snapshot'],
            ]
        );



        return response()->json(
            [
                'id' => $id,
                'snapshot' => $request['snapshot'],
                'w' => $w
            ]
        );
    }

    public function sendMail(Request $request)
    {
        // Предположим, что вы получаете данные поставщиков из запроса
        $suppliers = $request->input('suppliers');

        // Отправка письма
        Mail::to('gg-gg13@bk.ru')->send(new SupplierMail($suppliers));

        return response()->json(['message' => 'Письмо отправлено!']);
    }
}
