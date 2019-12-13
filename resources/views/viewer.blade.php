<html>

<head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      <link rel="stylesheet" href="{{ asset('css/app.css')}}">

      <!-- The Viewer CSS -->
      <link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/style.min.css" type="text/css">

      <script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/6.*/viewer3D.min.js"></script>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
      <script src="{{ asset('js/app.js') }}"></script>
      <title>IPZ</title>
</head>

<body class="row" style="margin:0">

      <div>@include('navigation.nav-top')</div>
      <div class="col-md-auto side-wrap">@include('navigation.nav-side')</div>
      <div class="col-md content-wrap" >
            @include ('content.forgeViewer', ['token'=>$tokenInfo])
      </div>
      @yield('content')

</body>

</html>