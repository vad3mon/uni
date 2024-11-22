<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Document</title>
</head>
<body>
    <div id="app">
{{--        <div id="toolbar">--}}
{{--            <button id="b1">log</button>--}}
{{--            <button id="b2">logg</button>--}}
{{--        </div>--}}

        <div id="univer"></div>
    </div>
    @vite('resources/js/app.js')
{{--    <script src="{{ mix('js/app.js') }}"></script>--}}

    <script>

    </script>

</body>

</html>
