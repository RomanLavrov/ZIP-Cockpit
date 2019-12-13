var elixir = require('laravel-elixir');
/*elixir(function(mix) {
      mix.scripts([         
          "/resources/js/app.js",
      ], );
  });*/

  elixir(function(mix){
      mix.scripts([
          'forgeApp.js'
      ], './public/js/app.min.js');
  });