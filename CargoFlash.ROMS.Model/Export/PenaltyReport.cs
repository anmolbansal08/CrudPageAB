using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Export
{
     [KnownType(typeof(PenaltyReport))]
   public  class PenaltyReport
    {
        public string PenaltyType { get; set; }
        public string AirLineSNo { get; set; }
        public string BookingFromDate { get; set; }
        public string BookingToDate { get; set; }
        public string AirLineName { get; set; }
        public string AWBNumber  { get; set; }

        public string AWBDate  { get; set; }
        public string  Origin { get; set; }
        public string  Destination { get; set; }

        public string  AjentName { get; set; }

        public string PCS { get; set; }

        public string  GrossWeight { get; set; }

        public string  SHC { get; set; }

        public string  ProductName { get; set; }

        public string Commidity { get; set; }

        public string  PenaltyCharges { get; set; }
        public string UserName { get; set; }
        public string  PenaltyApplyDate { get; set; }
        public string ModeOfPenalty { get; set; }
        public string AccountSNo { get; set; }
        public string BookedBy { get; set; }
        public string PenaltyWeight { get; set; }
        public string Remarks { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Tax { get; set; }
        public string TotalPenalty { get; set; }
        public string OriginCity { get; set; }
        public string AWBNo { get; set; }
        public string PenaltyParameterReferenceNo { get; set; }
        public string Status { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedDateandTime { get; set; }
        public string SNo { get; set; }
        public string PenaltyCurrency { get; set; }
    }


     [KnownType(typeof(PenaltyRquestReport))]
     public class PenaltyRquestReport
     {

        public int IsAutoProcess { get; set; }
        public Nullable<DateTime> FromDate { get; set; }
         public Nullable<DateTime> ToDate { get; set; }
         public Nullable<int> AirLineSNo { get; set; }
         public int PenaltyType { get; set; }
         public string OriginCity { get; set; }
         public string FlightNo { get; set; }
         public string AWBNo { get; set; }
         public int AccountSNo { get; set; }
         public string ReferenceNumber { get; set; }
        public string FlightDate { get; set; }
        public Nullable<DateTime> BookingDate { get; set; }
        public string ReportType { get; set; }

    }

    [KnownType(typeof(AWBPenaltyUpdateForApproval))]
    public class AWBPenaltyUpdateForApproval
    {
        public string usersno { get; set; }
        public string SNo { get; set; }
        public string RemarksForApproval { get; set; }
    }


    [KnownType(typeof(AWBPenaltyReportCityUserWise))]
    public class AWBPenaltyReportCityUserWise
    {
        public string usersno { get; set; }
        public string Cities { get; set; }
        public string IsAll { get; set; }
       
    }
}
