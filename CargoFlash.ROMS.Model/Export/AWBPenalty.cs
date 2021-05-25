using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Export
{



    [KnownType(typeof(AWBPenalty))]
    public class AWBPenalty
    {
        public string PenaltyType { get; set; }
        public string ReferenceNumber { get; set; }
        public string BookingFromDate { get; set; }
        public string BookingToDate { get; set; }
        public string AWBNo { get; set; }
        public string AWBPieces { get; set; }
        public string GrossWeight { get; set; }
        public string Volume { get; set; }
        public string TotalPenaltyCharges { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AgentName { get; set; }
        public string ProductName { get; set; }
        public string CommodityDescription { get; set; }
        public string CreatedDate { get; set; }
        public string AccountSno { get; set; }
        public string GroupName { get; set; }
        public string Status { get; set; }
        public string ExecutedGrossWeight { get; set; }
        public string TaxOnPenalty { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string TotalPenalty { get; set; }
        public string ReferencePenaltyParameter { get; set; }
        public string PenaltyCurrency { get; set; }
    }
    [KnownType(typeof(AWBPenaltyUpdate))]
    public class AWBPenaltyUpdate
    {
        public string AWBNo { get; set; }
        public string GetPenalty { get; set; }
        public string PenaltyType { get; set; }
        public string usersno { get; set; }
        public string PenalTyMode { get; set; }
        public string Remarks { get; set; }
        public string TaxOnPenalty { get; set; }
        public string TotalPenalty { get; set; }
        public string PenaltyReferenceNo { get; set; }
        /*
        public string ReferenceNumber { get; set; }
       
        public string PenaltyType { get; set; }
        public string PenaltyCharges { get; set; }
      
        public string PenaltyExecutedBy { get; set; }
        */


    }

    public class AWBPenaltAgentMessageForJT
    {
        public string AWBNo { get; set; }
 
        public string PenaltyType { get; set; }
        public string usersno { get; set; }
        public string PenalTyMode { get; set; }
      
       
        /*
        public string ReferenceNumber { get; set; }
       
        public string PenaltyType { get; set; }
        public string PenaltyCharges { get; set; }
      
        public string PenaltyExecutedBy { get; set; }
        */


    }

    public class AWBPenaltyMessageforBuildUPInVoidPenalty
    {
        public string AWBNo { get; set; }

        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
       
    }

    public class AWBPenaltyMessageforBuildUPInVoidPenaltyResponse
    {
        public string ReturnError { get; set; }

        public string Message { get; set; }
        public string AWBNo { get; set; }
        public string Status { get; set; }
    }

}
