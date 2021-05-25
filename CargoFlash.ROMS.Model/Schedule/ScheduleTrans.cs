using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Schedule
{/*
   *****************************************************************************
   Class Name:		ScheduleTrans      
   Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                   Implemenatation of class is perfomed in WEBUIs and Services 
   Company:		CargoFlash 
   Author:			Anand
   Created On:		04 Apr 2014
   Approved By:    
   Approved On:	
   *****************************************************************************
   */
    [KnownType(typeof(ScheduleTrans))]
    public class ScheduleTrans
    {
        /// <summary> 
        /// SNo for the entity as primary key 
        /// </summary>
        public int SNo { get; set; }
        /// <summary>
        /// ScheduleType for the entity
        /// </summary>
        public int ScheduleSNo { get; set; }
        public int ScheduleType { get; set; }
        /// <summary>
        /// FlightNo for the entity which is 8 character long 
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// OriginAirportSNo for the entity
        /// </summary>
        public int HdnOrigin { get; set; }
        /// <summary>
        /// OriginAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Origin { get; set; }
        /// <summary>
        /// ETD for the entity
        /// </summary>
        public string ETD { get; set; }
        /// <summary>
        /// DestinationAirPortSNo for the entity
        /// </summary>
        public int HdnDestination { get; set; }
        /// <summary>
        /// DestinationAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Destination { get; set; }
        /// <summary>
        /// ETA for the entity
        /// </summary>
        public string ETA { get; set; }
        /// <summary>
        /// Confirm whether Schedule is DayLightSaving or not
        /// </summary>
        public bool IsDayLightSaving { get; set; }
        public string DayLightSaving { get; set; }
        /// <summary>
        /// DayDifference for the entity 
        /// </summary>
        public int DayDifference { get; set; }
        public int SDDifference { get; set; }

        /// <summary>
        /// StartDate for the entity
        /// </summary>
        public string StartDate { get; set; }
        /// <summary>
        /// EndDate for the entity
        /// </summary>
        public string EndDate { get; set; }
        /// <summary>
        /// AirCraftSNo for the entity
        /// </summary>
        public int HdnAirCraft { get; set; }
        public string AirCraft { get; set; }
        /// <summary>
        /// FlightTypeSNo for the entity
        /// </summary>
        public int HdnFlightType { get; set; }
        public string FlightType { get; set; }
        /// <summary>
        /// AllocatedGrossWeight for the entity
        /// </summary>
        public decimal AllocatedGrossWeight { get; set; }
        /// <summary>
        /// AllocatedVolumeWeight for the entity
        /// </summary>
        public decimal AllocatedVolumeWeight { get; set; }
        /// <summary>
        /// MaxGrossPerPcs for the entity
        /// </summary>
        public int MaxGrossPerPcs { get; set; }
        public decimal MaxVolumePerPcs { get; set; }
        /// <summary>
        /// Confirm whether Schedule is in days
        /// </summary>
        public bool AllDays { get; set; }
        public string lblAllDays { get; set; }
        public string AllDay { get; set; }

        public bool Day1 { get; set; }
        public string lblDay1 { get; set; }
        public string Sun { get; set; }
        public bool Day2 { get; set; }
        public string lblDay2 { get; set; }
        public string Mon { get; set; }
        public bool Day3 { get; set; }
        public string lblDay3 { get; set; }
        public string Tue { get; set; }
        public bool Day4 { get; set; }
        public string lblDay4 { get; set; }
        public string Wed { get; set; }
        public bool Day5 { get; set; }
        public string lblDay5 { get; set; }
        public string Thu { get; set; }
        public bool Day6 { get; set; }
        public string lblDay6 { get; set; }
        public string Fri { get; set; }
        public bool Day7 { get; set; }
        public string lblDay7 { get; set; }
        public string Sat { get; set; }
        /// <summary>
        /// Confirm whether Schedule is Active or not
        /// </summary>
        public bool IsActive { get; set; }
        public string lblIsActive { get; set; }
        public String Active { get; set; }
        /// <summary>
        /// Confirm whether Schedule is FirstLeg or not
        /// </summary>
        public bool IsFirstLeg { get; set; }
        public string lblIsFirstLeg { get; set; }
        public string FirstLeg { get; set; }
        /// <summary>
        /// NoOfStop for the entity
        /// </summary>
        public int NoOfStop { get; set; }
        public string lblNoOfStop { get; set; }
        /// <summary>
        /// Confirm whether Schedule is CAO or not
        /// </summary>
        public bool IsCAO { get; set; }
        public string lblIsCAO { get; set; }
        public String CAO { get; set; }
        /// <summary>
        /// DestinationAirportCode for the entity which is 3 character long 
        /// </summary>
        public string Routing { get; set; }
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
        public string Addlegs { get; set; }
        public string ALTCarrierCode { get; set; }
        public string ALTFlightNumber { get; set; }
        public string HdnALTCarrierCode { get; set; }
          /// <summary>
        /// property added For aircraft capacity,OverBookingcapacity Volume,Freesale Capcity Volume  and details in Schedule trans  property added by vikram 
        /// </summary>
        public bool IsCodeShare { get; set; }
        public string CodeShare { get; set; }
        public string lblCodeShare { get; set; }        
        public string CodeShareCarrierCode { get; set; }
        public string CodeShareFlightNumber { get; set; }
        public string CodeShareFlightNo { get; set; }
        public int OverBookingCapacity  { get; set; }
        public int FreeSaleCapacity { get; set; }
        public Decimal OverBookingCapacityVol { get; set; }
        public Decimal FreeSaleCapacityVol { get; set; }  // OverBookingcapacity Volume 
        public string UMG { get; set; }
        public string UMV { get; set; }
        public string HdnUMG { get; set; }
        public string HdnUMV { get; set; }
        public int ReservedCapacity { get; set; }
        public Decimal ReservedCapacityVol { get; set; }
        public int HdnLegId { get; set; }
        public int HdnIsLeg { get; set; }
        public bool IsCharter { get; set; }
        public string lblIsCharter { get; set; }
        public string Charter { get; set; }
        public int AddLegNo { get; set; }
        public int RowID { get; set; }
        // IsCodeShare,CodeShareCarrierCode,CodeShareFlightNumber,CodeShareFlightNo
    }

    [KnownType(typeof(GetScheduleTrans))]
    public class GetScheduleTrans
    {
        public int RecordID { get; set; }
        public string PageType { get; set; }
    }
}
