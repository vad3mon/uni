<!DOCTYPE html>
<html>
<head>
    <title>Таблица поставщиков</title>
</head>
<body>
<h1>Таблица поставщиков</h1>
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
    <tbody>
    @foreach ($suppliers as $supplier)
        <tr>
            <td>{{ $supplier['code'] }}</td>
            <td>{{ $supplier['carModel'] }}</td>
            <td>{{ $supplier['carNumber'] }}</td>
            <td>{{ $supplier['trailerModel'] }}</td>
            <td>{{ $supplier['trailerNumber'] }}</td>
            <td>{{ $supplier['tons'] }}</td>
            <td>{{ $supplier['driver'] }}</td>
            <td>{{ $supplier['phone'] }}</td>
            <td>{{ $supplier['payer'] }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
