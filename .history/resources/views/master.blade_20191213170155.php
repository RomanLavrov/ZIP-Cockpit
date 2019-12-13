<html>

<head>
   <meta charset="UTF-8">
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
   <link rel="stylesheet" href="{{ asset('css/app.css')}}">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

   <script src="{{ asset('js/app.js') }}"></script>
   <title>IPZ</title>
</head>

<body class="row" style="margin:0">
   <div>@include('navigation.nav-top')</div>
   <div class="col-md-auto side-wrap">@include('navigation.nav-side')</div>
   <div class="col-md content-wrap" >
      <div>@include('content.dashboard', ['rooms'=>$data, , 'sensorsData'=>$sensorsData])</div>
   </div>
   @yield('content')
</body>

</html>