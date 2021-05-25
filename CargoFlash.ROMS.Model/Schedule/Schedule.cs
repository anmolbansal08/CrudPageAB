using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Schedule
{ /*
   *****************************************************************************
   Class Name:		Schedule      
   Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                   Implemenatation of class is perfomed in WEBUIs and Services 
   Company:		CargoFlash 
   Author:			Anand
   Created On:		20 Mar 2014
   Approved By:    
   Approved On:	
   *****************************************************************************
   */
    [KnownType(typeof(Schedule))]
    public class Schedule
    {
        /// <summary>
        /// SNo for the entity as primary key 
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// ScheduleType for the entity
        /// </summary>
        public int ScheduleType { get; set; }
        public string ScheduleTypeName { get; set; }

        public Nullable<DateTime> FStartDate { get; set; }

        public Nullable<DateTime> FEndDate { get; set; }

        /// <summary>
        /// AirlineSNo  for the entity
        /// </summary>
        public int AirlineSNo { get; set; }
        /// <summary>
        /// AWBCode for the entity which is 3 character long 
        /// </summary>
        public string AWBCode { get; set; }
        /// <summary>
        /// CarrierCode for the entity which is 2 character long 
        /// </summary>
        public string CarrierCode { get; set; }
        public string Text_CarrierCode { get; set; }

        /// <summary>
        /// FlightNumber for the entity which is 4 character long 
        /// </summary>
        public string FlightNumber { get; set; }
        public string SingleAlpha { get; set; }
        /// <summary>
        /// FlightNo for the entity which is 8 character long 
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// OriginAirportSNo for the entity
        /// </summary>
        /// 

        public bool OperatedasTruck { get; set; }
        public string IsOperatedasTruck { get; set; }
        public int Origin { get; set; }
        /// <summary>
        /// OriginAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Text_Origin { get; set; }
        /// <summary>
        /// DestinationAirPortSNo for the entity
        /// </summary>
        public int Destination { get; set; }
        /// <summary>
        /// DestinationAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Text_Destination { get; set; }
        /// <summary>
        /// DestinationAirportCode for the entity which is 3 character long 
        /// </summary>
        /// 
        public string ViaRoute { get; set; }
        public string Text_ViaRoute { get; set; }
        public string Routing { get; set; }
        /// <summary>
        /// Confirm whether Schedule is CAO or not
        /// </summary>
        public bool IsCAO { get; set; }
        public String CAO { get; set; }
        /// <summary>
        /// Confirm whether Schedule is Active or not
        /// </summary>
        public bool IsActive { get; set; }
        public String Active { get; set; }

        public bool IsSch { get; set; }
        public String Sch { get; set; }
        /// <summary>
        /// User who created this record
        /// </summary>
        //public String CreatedOn { get; set; }
        public String CreatedBy { get; set; }
        /// <summary>
        /// User who updated the record
        /// </summary>
        //public String UpdatedOn { get; set; }// NOT NULL,
        public String UpdatedBy { get; set; }// NOT NULL,
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public string PreAlertDate { get; set; }
        public string PreAlertTime { get; set; }

        public string ISRfs { get; set; }
        //Two Field For OverBookingCapacity  and FreeSaleCapacity addedin schedule by Vikram 28/12/2016
        public int OverBookingCapacity { get; set; }
        public int FreeSaleCapacity { get; set; }

        public string OpenedUpto { get; set; }
    }

    [KnownType(typeof(ScheduleDetails))]
    public class ScheduleDetails
    {
        /// <summary>
        /// SNo for the entity as primary key 
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// ScheduleType for the entity
        /// </summary>
        public int ScheduleType { get; set; }
        public string ScheduleTypeName { get; set; }
        /// <summary>
        /// AirlineSNo  for the entity
        /// </summary>
        public int AirlineSNo { get; set; }
        /// <summary>
        /// AWBCode for the entity which is 3 character long 
        /// </summary>
        public string AWBCode { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        /// <summary>
        /// CarrierCode for the entity which is 2 character long 
        /// </summary>
        public string CarrierCode { get; set; }
        public string Text_CarrierCode { get; set; }
        /// <summary>
        /// FlightNumber for the entity which is 4 character long 
        /// </summary>
        public string FlightNumber { get; set; }
        /// <summary>
        /// FlightNo for the entity which is 8 character long 
        /// </summary>
        public string FlightNo { get; set; }



        public bool OperatedasTruck { get; set; }
        public string IsOperatedasTruck { get; set; }
        /// <summary>
        /// OriginAirportSNo for the entity
        /// </summary>
        public int Origin { get; set; }
        /// <summary>
        /// OriginAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Text_Origin { get; set; }
        /// <summary>
        /// DestinationAirPortSNo for the entity
        /// </summary>
        public int Destination { get; set; }
        /// <summary>
        /// DestinationAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Text_Destination { get; set; }
        /// <summary>
        /// DestinationAirportCode for the entity which is 3 character long 
        /// </summary>
        /// 
        public string ViaRoute { get; set; }
        public string Text_ViaRoute { get; set; }
        public string Routing { get; set; }
        public string TextRouting { get; set; }
        /// <summary>
        /// Confirm whether Schedule is CAO or not
        /// </summary>
        public bool IsCAO { get; set; }
        public String CAO { get; set; }
        /// <summary>
        /// Confirm whether Schedule is Active or not
        /// </summary>
        public bool IsActive { get; set; }
        public String Active { get; set; }

        public bool IsSch { get; set; }
        public String Sch { get; set; }
        /// <summary>
        /// User who created this record
        /// </summary>
        //public String CreatedOn { get; set; }
        public String CreatedBy { get; set; }
        /// <summary>
        /// User who updated the record
        /// </summary>
        //public String UpdatedOn { get; set; }// NOT NULL,
        public String UpdatedBy { get; set; }// NOT NULL,
        public System.Data.DataTable dt { get; set; }

        public string PreAlertDate { get; set; }
        public string PreAlertTime { get; set; }
    }

    [KnownType(typeof(OpenFlight))]
    public class OpenFlight
    {
        public string origin { get; set; }
        public string destination { get; set; }
        public string SD { get; set; }
        public string ED { get; set; }
        public string Airline { get; set; }
        public string CarrierCode { get; set; }
        public string ScheduleType { get; set; }
        public int createdBy { get; set; }
    }

    [KnownType(typeof(FlightDetail))]
    public class FlightDetail
    {
        public string Date { get; set; }
        public string FlightNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
    }

    [KnownType(typeof(ValidateSchedule))]
    public class ValidateSchedule
    {
        public int SNo { get; set; }
        public int ScheduleType { get; set; }
        public int AirlineSNo { get; set; }
        public string FlightNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string TextRouting { get; set; }
        public bool IsActive { get; set; }
        public bool OperatedasTruck { get; set; }
        public List<ValidateScheduleTrans> ValidateScheduleTrans { get; set; }
    }


    [KnownType(typeof(ValidateScheduleTrans))]
    public class ValidateScheduleTrans
    {
        public int SNo { get; set; } 
        public int ScheduleSNo { get; set; }
        public int RowID { get; set; }
        public int ScheduleType { get; set; } 
        public int OriginSNo { get; set; }
        public int DestinationSNo  { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string ETA { get; set; } 
        public string ETD { get; set; } 
        public bool Day1 { get; set; }
        public bool Day2 { get; set; }
        public bool Day3 { get; set; }
        public bool Day4 { get; set; }
        public bool Day5 { get; set; }
        public bool Day6 { get; set; }
        public bool Day7 { get; set; }
        public int? DayDifference { get; set; }
        public int? SDDifference { get; set; }
        public int DepartureSequence { get; set; }
        public int AddLegNo { get; set; }
        public bool IsLeg { get; set; }
        public int LegId { get; set; }
        public int AirCraftSNo { get; set; }
        public string AirCraftName { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal FreeSaleCapacity { get; set; }
        public decimal FreeSaleCapacityVol { get; set; }
        public decimal ReservedCapacity { get; set; }
        public decimal ReservedCapacityVol { get; set; }
        public decimal OverBookingCapacity { get; set; }
        public decimal OverBookingCapacityVol { get; set; }
        public decimal MaxGrossPerPcs { get; set; }
        public decimal MaxVolumePerPcs { get; set; }
        public string UMG { get; set; }
        public string UMV { get; set; }
        public bool IsCAO { get; set; }    
	    public bool IsCharter { get; set; }
        public bool IsDayLightSaving { get; set; }
	    public bool IsCodeShare { get; set; }
        public string ALTCarrierCode { get; set; }
        public string ALTFlightNumber { get; set; }
        public string CodeShareCarrierCode { get; set; }
	    public string CodeShareFlightNo { get; set; }
	    public int FlightTypeSNo { get; set; }
        public string FlightType { get; set; }
    }
}
