/*
*****************************************************************************
Javascript Name:	OfficeJS     
Purpose:		    This JS used to get autocomplete for office.
Company:		    CargoFlash Infotech Pvt Ltd.
Author:			    BadiuzzAman Khan
Created On:		    5 March 2014
Updated By:         
Updated On:	        
Approved By:        
Approved On:	    
*****************************************************************************
*/
//var pageType = $('#hdnPageType').val();
//var updatedRows = new Array();
$(document).ready(function () {
    cfi.ValidateForm();
    $('#aspnetForm').attr("enctype", "multipart/form-data");
    cfi.AutoComplete("OriginAirportSNo", "AirportName,AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("DestinationAirportSNo", "AirportName,AirportCode", "Airport", "SNo", "AirportCode", ["AirportCode", "AirportName"], null, "contains");
    cfi.AutoComplete("CarrierCode", "CarrierCode", "Airline", "CarrierCode", "CarrierCode", null, null, "contains");
    cfi.AutoComplete("FlightTypeSNo", "FlightTypeName", "FlightType", "SNo", "FlightTypeName", null, null, "contains");
});