$(document).ready(function ()
{
    cfi.ValidateForm();
    //cfi.AutoComplete("LocationTypeSNo", "Description", "MovementType", "SNo", "Description", ["Description"], null, "contains");
    //cfi.AutoComplete("LocationSubTypeSNo", "SubType", "LocationSubType", "SNo", "SubType", ["SubType"], null, "contains");
    cfi.AutoComplete("AirlineSno", "CarrierCode,AirlineName", "vwAirline", "SNo", "CarrierCode", ["CarrierCode", "AirlineName"], null, "contains");
    cfi.AutoComplete("RateClassSno", "RateClassCode", "vwRateClass", "SNo", "RateClassCode", ["RateClassCode"], null, "contains");
    // cfi.AutoComplete("ULDTypeSno", "ContainerType", "vwULDType", "SNo", "ContainerType", ["ContainerType"], null, "contains");
    //cfi.AutoComplete("AirlineSno", "AirlineName", "Airline", "SNo", "AirlineName", ["AirlineName"], null, "contains");
    //cfi.AutoComplete("SPHCSNo", "Code", "SPHC", "SNo", "Code", ["Code"], null, "contains");
    //cfi.AutoComplete("CommoditySNo", "CommodityCode", "Commodity", "SNo", "CommodityCode", ["CommodityCode"], null, "contains");
    //cfi.AutoComplete("DestinationCitySNo", "CityCode", "City", "SNo", "CityCode", ["CityCode"], null, "contains");
    //cfi.AutoComplete("CityCode", "CityCode", "City", "CityCode", "CityCode", ["CityCode"], null, "contains");
    //cfi.AutoComplete("CountrySNo", "CountryName", "Country", "SNo", "CountryName", ["CountryName"], null, "contains");
    $('#CommonDesignation').hide();
    $('#spnCommonDesignation').text('');
    $('#spnCommonDesignation').parent().removeAttr('title');
    $('span#CommonDesignation').text('');

    $('#Text_ULDTypeSno').hide();
    $('span#spnULDTypeSno').hide();
    $('span#spnULDTypeSno').parent().removeAttr('title'); 
    $('span#spnULDType').hide();
    $('span#spnULDType').parent().removeAttr('title');
    
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE") {
        $("#VolumeWeight").after("&nbsp;&nbsp;<span id='CBM'></span>");
        $("#Length").after("&nbsp;&nbsp;<span id='LengthUnit'></span>");
        $("#Width").after("&nbsp;&nbsp;<span id='WidthUnit'></span>");
        $("#Height").after("&nbsp;&nbsp;<span id='HeightUnit'></span>");
        $("#_tempEmptyWeight").before("<span id='lblKG'>(kg) </span>");
        $("#_tempGrossWeight").before("<span id='lblKG'>(kg) </span>");
        $("#_tempVolumeWeight").before("<span id='lblKG'></span>");
        $("#_tempPivotWeight").before("<span id='lblKG'>(kg) </span>");
        if ($('#Height').val() == 0.00)
        {
            $('#_tempHeight').val('');
            $('#Height').val('');
        }
    }
    else
    {
        $("span#VolumeWeight").after("&nbsp;&nbsp;<span id='CBM'  style='display: inline-block;overflow: auto;'></span>");
        $("span#Length").after("&nbsp;&nbsp;<span id='LengthUnit'  style='display: inline-block;overflow: auto;'></span>");
        $("span#Width").after("&nbsp;&nbsp;<span id='WidthUnit'  style='display: inline-block;overflow: auto;'></span>");
        $("span#Height").after("&nbsp;&nbsp;<span id='HeightUnit'  style='display: inline-block;overflow: auto;'></span>");
        $("#GrossWeight").before("<span id='lblKG' style='display: inline-block;overflow: auto;'>(kg)&nbsp;&nbsp;</span>");
        $("#VolumeWeight").before("<span id='lblKG'  style='display: inline-block;overflow: auto;'>&nbsp;&nbsp;</span>");
        $("#EmptyWeight").before("<span id='lblKG'  style='display: inline-block;overflow: auto;'>(kg)&nbsp;&nbsp;</span>");

        if ($('#Height').val() == 0.00)
        {
            $('span#Height').hide();
            $('span#HeightUnit').hide();
        }
    }
    $(document).keydown(function (event)
    {
        if (event.ctrlKey == true && (event.which == '118' || event.which == '86'))
        {
            event.preventDefault();
        }
    });
    //$(document).on("contextmenu", function (e)
    //{
    //    alert('Right click disabled');
    //    return false;
    //});
    $(document).on('drop', function ()
    {
        return false;
    });
    //function TotalVolumeWeightByCM()
    //{
    //    var Length = $("#Length").val();
    //    var Width = $("#Width").val();
    //    var Height = $("#Height").val();
    //    if (Length != '' && Width != '' && Height != '')
    //    {
    //        var Totalvolumeweight = Length * Width * Height / userContext.SysSetting.CMSDivisor
    //        var result = $("#_tempVolumeWeight").val(Totalvolumeweight.toFixed(3));
    //        var VolumeWeight = Totalvolumeweight / userContext.SysSetting.CalculateCBM
    //        $("#CBM").html("[" + VolumeWeight.toFixed(3) + " CBM]");
    //    }
    //}
    //function TotalVolumeWeightByINCH()
    //{
    //    var Length = $("#Length").val();
    //    var Width = $("#Width").val();
    //    var Height = $("#Height").val();
    //    if (Length != '' && Width != '' && Height != '')
    //    {
    //        var Totalvolumeweight = Length * Width * Height / userContext.SysSetting.INHDivisor
    //        var result = $("#_tempVolumeWeight").val(Totalvolumeweight.toFixed(3));
    //        var VolumeWeight = Totalvolumeweight / userContext.SysSetting.CalculateCBM
    //        $("#CBM").html("[" + VolumeWeight.toFixed(3) + " CBM]");
    //    }
    //}
    $("#VolumeWeight").keyup(function ()
    {
        var VolumeWeight = $(this).val() * userContext.SysSetting.CalculateCBM;
        $("#CBM").html("[" + VolumeWeight.toFixed(3) + " Volume Weight]");
    });

    var VolumeWeight = $("#VolumeWeight").val() * userContext.SysSetting.CalculateCBM;
    $("#CBM").html("[" + VolumeWeight.toFixed(3) + " Volume Weight]");

    $("#Length").keyup(function ()
    {
        $("#LengthUnit").show();
        if ($("input[id='Unit']").prop('checked') == true) // CM is True
        {//into inch
            var l = $("#Length").val() * 0.39370;
            $("#LengthUnit").html("[" + l.toFixed(3) + " INCH]");
            //TotalVolumeWeightByCM();
        }
        else
        {
            $("#LengthUnit").show();
            var l = $("#Length").val() / 0.39370;
            $("#LengthUnit").html("[" + l.toFixed(3) + " CM]");
            //TotalVolumeWeightByINCH();
        }
    });
    $("#Width").keyup(function ()
    {
        $("#WidthUnit").show();
        if ($("input[id='Unit']").prop('checked') == true) // CM is True
        {//into inch
            var w = $("#Width").val() * 0.39370;
            $("#WidthUnit").html("[" + w.toFixed(3) + " INCH]");
            //TotalVolumeWeightByCM();
        }
        else
        {
            $("#WidthUnit").show();
            var w = $("#Width").val() / 0.39370;
            $("#WidthUnit").html("[" + w.toFixed(3) + " CM]");
            //TotalVolumeWeightByINCH();
        }
    });
    $("#Height").keyup(function ()
    {
        $("#HeightUnit").show();
        if ($("input[id='Unit']").prop('checked') == true) // CM is True
        {//into inch
            var h = $("#Height").val() * 0.39370;
            $("#HeightUnit").html("[" + h.toFixed(3) + " INCH]");
            //TotalVolumeWeightByCM();
        }
        else
        {
            $("#HeightUnit").show();
            var h = $("#Height").val() / 0.39370;
            $("#HeightUnit").html("[" + h.toFixed(3) + " CM]");
            //TotalVolumeWeightByINCH();
        }
    });
    
    if (getQueryStringValue("FormAction").toUpperCase() == "NEW" || getQueryStringValue("FormAction").toUpperCase() == "EDIT" || getQueryStringValue("FormAction").toUpperCase() == "DUPLICATE")
    {
        if ($("input[id='Unit']").prop('checked') == true) // CM is True
        {//into inch
            var l = $("#Length").val() * 0.39370;
            var w = $("#Width").val() * 0.39370;
            var h = $("#Height").val() * 0.39370;
            $("#LengthUnit").html("[" + l.toFixed(3) + " INCH]");
            $("#WidthUnit").html("[" + w.toFixed(3) + " INCH]");
            $("#HeightUnit").html("[" + h.toFixed(3) + " INCH]");
            //TotalVolumeWeightByCM();
        }
        else
        {
            //into CM
            var l = $("#Length").val() / 0.39370;
            var w = $("#Width").val() / 0.39370;
            var h = $("#Height").val() / 0.39370;
            $("#LengthUnit").html("[" + l.toFixed(3) + " CM]");
            $("#WidthUnit").html("[" + w.toFixed(3) + " CM]");
            $("#HeightUnit").html("[" + h.toFixed(3) + " CM]");
            //TotalVolumeWeightByINCH();
        }
    }
    else
    {
        if ($('span#Text_Units').html() == "INCH")
        {
            var l = $("span#Length").html() / 0.39370;
            var w = $("span#Width").html() / 0.39370;
            var h = $("#Height").val() / 0.39370;
            $("#LengthUnit").html("[" + l.toFixed(3) + " CM]");
            $("#WidthUnit").html("[" + w.toFixed(3) + " CM]");
            $("#HeightUnit").html("[" + h.toFixed(3) + " CM]");
            //TotalVolumeWeightByINCH();
        }
        else
        {
            var l = $("span#Length").html() * 0.39370;
            var w = $("span#Width").html() * 0.39370;
            var h = $("#Height").val() * 0.39370;
            $("#LengthUnit").html("[" + l.toFixed(3) + " INCH]");
            $("#WidthUnit").html("[" + w.toFixed(3) + " INCH]");
            $("#HeightUnit").html("[" + h.toFixed(3) + " INCH]");
            //TotalVolumeWeightByCM();
        }
    }
    $("input[id='Unit']").click(function ()
    {
       
        if ($("input[id='Unit']").prop('checked') == true) // CM is True
        {//into inch
         
            var l = $('#_tempLength').val('');
            var w = $("#_tempWidth").val('');
            var h = $("#_tempHeight").val('');
            var temp = $("#_tempVolumeWeight").val('');
            $("#Length").val('');
            $("#Width").val('');
            $("#Height").val('');
            $("#CBM").html("[0.000 CBM]");
            $("#LengthUnit").html("[0.000 INCH]");
            $("#HeightUnit").html("[0.000 INCH]");
            $("#WidthUnit").html("[0.000 INCH]");
            
        }
        else {//into CM
         
            var l = $("#_tempLength").val('');
            var w = $("#_tempWidth").val('');
            var h = $("#_tempHeight").val('');
            var temp = $("#_tempVolumeWeight").val('');
            $("#Length").val('');
            $("#Width").val('');
            $("#Height").val('');
            $("#CBM").html("[0.000 CBM]");
            $("#HeightUnit").html("[0.000 CM]");
            $("#WidthUnit").html("[0.000 CM]");
            $("#LengthUnit").html("[0.000 CM]");
        }
    });
});



