using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.SpaceControl
{
    [KnownType(typeof(Allocation))]
    public class Allocation
    {
        public int SNo { get; set; }
        public int AircraftSNo { get; set; }
        public string AllocationCode { get; set; }
        public int OriginAirportSNo { get; set; }
        public int DestinationAirportSNo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CarrierCode { get; set; }
        public string FlightNumber { get; set; }
        public string FlightNo { get; set; }
        public string Remarks { get; set; }
        public Boolean IsActive { get; set; }
        public int CreatedBy { get; set; }
        public string AircraftType {get; set;}
        public string OrginAirportName { get; set;}
        public string DestinationAirportName { get; set; }
        public string Text_OriginAirportSNo { get; set; }
        public string Text_DestinationAirportSNo { get; set; }
        public string Text_AircraftSNo { get; set; }
        public string Text_CarrierCode { get; set; }



    }
     [KnownType(typeof(AllocationTrans))]
    public class AllocationTrans
    {
        public int sno { get; set; }
        public int AllocationSNo {get; set;}
        public string AllocationAirportSNo {get; set;}
        public int HdnAllocationAirportSNo { get; set; }
        public string Text_AllocationAirportSNo { get; set; }
        //public Boolean Day1 { get; set; }
        //public Boolean Day2 {get; set;}
        //public Boolean Day3 {get; set;}
        //public Boolean Day4 {get; set;}
        //public Boolean Day5 {get; set;}
        //public Boolean Day6 {get; set;}
        //public Boolean Day7 {get; set;}

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
        public string StartDate {get; set;}
        public string EndDate {get; set;}
        public decimal GrossWeight {get; set;}
        public decimal VolumeWeight {get; set;}
        public Int16 ReleaseTime {get; set;}
        public int CreatedBy {get; set;}
        public bool IsActive { get; set; }

         //Allocation Trans ULD

        public Int32 Unit { get; set; }
        public decimal GWeight { get; set; }
        public decimal VWeight { get; set; }
        public string UldTypeSNo { get; set; }
        public Int32 HdnUldTypeSNo { get; set; }
        public bool UTIsActive { get; set; }
        public Int32 ATUSNo { get; set; }
    }
}
