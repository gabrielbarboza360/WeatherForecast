
$(function(){


// *** APIs ***
// clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
// pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
// pegar coordenadas do IP: http://www.geoplugin.net
// gerar gráficos em JS: https://www.highcharts.com/demo


var object = {
    cidade: "",
    estado:"",
    pais:"",
    temperatura:"",
    texto_clima:"",
    icone_clima:"",
}

function preencherClimaAgora(cidade,estado,pais,temperatura,texto_clima){

         var text_local = cidade + ", " + estado + ". " + pais;
         $("#texto_local").text(text_local);
         $("#texto_clima").text(texto_clima);
         $("#texto_temperatura").html(String(temperatura)+ "&deg");
         $('#icone_clima').css("background-image","url(' "+ object.icone_clima +" ')");


}




        var keyAPI = "lSUvjnBvjzNtXcnGTV6s3o6Pt72qFdlz";
        var mapboxToken = "pk.eyJ1IjoiZ2FicmllbGxsMzYwMCIsImEiOiJjbDQ5MXhqNTcweG4wM2NxaWc4NW13b3p4In0.fpvlecL4Cnuk3TJpvikwiA"

            function tempoAtual(localcode){

                $.ajax({
            
                    url: "http://dataservice.accuweather.com/currentconditions/v1/"+localcode+"?apikey=" + keyAPI + "&language=pt-br",
                    type: "GET",
                    datatype: "json",
                    success: function(data){
                        console.log("temperatura atual",data);

                       object.temperatura = data[0].Temperature.Metric.Value;
                       object.texto_clima = data[0].WeatherText;
                     

                        var iconeNumber = data[0].WeatherIcon <= 9 ? "0"+ String(data[0].WeatherIcon) : String(data[0].WeatherIcon);


                        object.icone_clima = "https://developer.accuweather.com/sites/default/files/" + iconeNumber + "-s.png";
 
                       preencherClimaAgora(object.cidade,object.estado,object.pais,object.temperatura,object.texto_clima,object.icone_clima);

                    },
                    error: function(){
                        console.log("erro");
                    }
                
                });
            }
 

             
            function  pegarPrevisao5Dias(localCode){

                $.ajax({

                    url: " http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+ localCode +"?apikey=" + keyAPI + "&language=pt-br&metric=true",
                    type: "GET",
                    datatype: "json",
                    success: function(data){
                       console.log("5 dias", data)

                       $("#texto_max_min").html( String(data.DailyForecasts[0].Temperature.Minimum.Value) + "&deg: /" + String(data.DailyForecasts[0].Temperature.Maximum.Value) + "&deg;");

                         preencherPrevisao5Dias(data.DailyForecasts);

                    },
                    error: function(){
                        console.log("erro");
                    }
                
                });
            }

           function preencherPrevisao5Dias(previsoes){
               $("#info_5dias").html("");

                  var diasSemana = ["domingo", "segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];

               for (var a = 0; a < previsoes.length; a++){

                   var dataHoje = new Date(previsoes[a].Date)
                   var dia_semana = diasSemana[dataHoje.getDay()];


                   var iconeNumber = previsoes[a].Day.Icon <= 9 ? "0" + String(previsoes[a].Day.Icon) : String(previsoes[a].Day.Icon);

                   icone_clima = "https://developer.accuweather.com/sites/default/files/" + iconeNumber + "-s.png";
                   maxima = String(previsoes[a].Temperature.Maximum.Value);
                   minima = String(previsoes[a].Temperature.Minimum.Value);

                   elementoHTMLDia =  '<div class="day col">';
                   elementoHTMLDia +=  '<div class="day_inner">';
                   elementoHTMLDia +=  '<div class="dayname">';
                   elementoHTMLDia +=     dia_semana;
                   elementoHTMLDia +=         '</div>';
                   elementoHTMLDia +=      '<div style="background-image: url(\' ' + icone_clima + '\')" class="daily_weather_icon"></div>'
                   elementoHTMLDia +=     '<div class="max_min_temp">'
                   elementoHTMLDia +=      '8&deg; / 16&deg;'
                   elementoHTMLDia +=     '   </div>'
                   elementoHTMLDia +=     '   </div>'
                   elementoHTMLDia +=     '   </div>'
                   $("#info_5dias").append(elementoHTMLDia);
                   elementoHTMLDia = "";
               }
           }



           
                            
                                
                                 
                            
    
                               
    
                       





            function localizacao(long,lat){

                $.ajax({
            
                    url: "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+keyAPI+"&q="+ long +"%2C"+lat+"&language=pt-br",
                    type: "GET",
                    datatype: "json",
                    success: function(data){
                        console.log("localização",data);

                        try{
                            object.cidade = data.ParentCity.LocalizedName;
                        }
                        catch{
                            object.cidade = data.LocalizedName;
                        }

                        object.estado = data.AdministrativeArea.LocalizedName;
                        object.pais = data.Country.LocalizedName;

                        var localCode = data.Key;
                        tempoAtual(localCode);
                        pegarPrevisao5Dias(localCode);


                    },
                    error: function(){
                        console.log("erro");
                    }
                
                });
            }



            function pegarCoordenadasDaPesquisa(input){
                  input = encodeURI(input);
                $.ajax({
            
                    url: "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ input +".json?access_token=" + mapboxToken,
                    type: "GET",
                    datatype: "json",
                    success: function(data){
                        console.log("localização",data);
                        var  long = data.features[0].geometry.coordinates[0];
                        var  lat = data.features[0].geometry.coordinates[1];
                        localizacao(lat,long);

                    },
                    error: function(){
                        console.log("erro");
                    }
                
                });
            }






















//localizacao(-23.968767185372084,-46.314225408206426);



           function pegarIP(){

               var lat_padrao = -22.981361;
               var long_padrao = -43.223176;

            $.ajax({
            
                url: "http://www.geoplugin.net/json.gp",
                type: "GET",
                datatype: "json",
                success: function(data){
                    
                    if(data.geoplugin_latitude && data.geoplugin_longitude){
                    localizacao(data.geoplugin_latitude,data.geoplugin_longitude);

                   }else{
                        localizacao(lat_padrao,long_padrao);
                   }
                },
                error: function(){
                    console.log("erro");
                }
            
            });
        }

        pegarIP();

        $("#search-button").click(function(){
            var local = $("input#local").val();
            if(local){
                pegarCoordenadasDaPesquisa(local);
            }else{
                alert('Local Invalido');
            }
        })

        $("input#local").on('keypress',function(e){
            if(e.which == 13){
                var local = $("input#local").val();
            if(local){
                pegarCoordenadasDaPesquisa(local);
            }else{
                alert('Local Invalido');
            }
            }
            
        })

    

});




