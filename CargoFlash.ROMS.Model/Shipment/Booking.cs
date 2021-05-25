using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{/*
   *****************************************************************************
   Class Name:		Booking      
   Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                   Implemenatation of class is perfomed in WEBUIs and Services 
   Company:		CargoFlash 
   Author:			Anand
   Created On:		12 May 2014
   Approved By:    
   Approved On:	
   *****************************************************************************
   */
    [KnownType(typeof(Booking))]
    public class Booking
    {

    }
    [KnownType(typeof(BookingGetTranistFWBGrid))]
    public class BookingGetTranistFWBGrid
    {
           public  string OriginCity      {get; set;} 
           public  string DestinationCity {get; set;}
           public  String FlightNo        {get; set;}
           public  string FlightDate      {get; set;}
        public String OutwardFlightNo { get; set; }
        public string OutwardFlightDate { get; set; }

        public  string AWBPrefix       {get; set;}
           public  string AWBNo           {get; set;}
           public  string LoggedInCity { get; set; }

           public string Arrived { get; set; }
        public string DaysNo { get; set; }
    }
}
