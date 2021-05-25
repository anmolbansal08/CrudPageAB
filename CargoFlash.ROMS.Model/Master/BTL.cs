using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(BTL))]
    public class BTL
    {

        public int SNo { get; set; }
        public string BTLName { get; set; }
        public int AirlineSNo { get; set; }
        public int Type { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public string DaysOfWeek { get; set; }
        public int BTLLevel { get; set; }
        public int BTLStatus { get; set; }
        public string BTLRemarks { get; set; }
        public string AircraftSNo { get; set; }
        public int AccountSNo { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public List<BTLFlightTrans> BTLFlightTrans { get; set; }
        public List<BTLPeriodTrans> BTLPeriodTrans { get; set; }

        public string Text_AirlineSNo { get; set; }
        public string Text_Type { get; set; }
        public string Text_BTLLevel { get; set; }
        public string Text_BTLStatus { get; set; }
        public string Text_AircraftSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public string Text_DaysOfWeek { get; set; }
    }

    [KnownType(typeof(BTLFlightTrans))]
    public class BTLFlightTrans
    {

        public int SNo { get; set; }
        public int BTLMasterSNo { get; set; }
        public string FlightNo { get; set; }
        public int NoOfPieces { get; set; }
        public int TotalWeight { get; set; }
        public int CommoditySNo { get; set; }
        public int SPHCSNo { get; set; }
    }

    [KnownType(typeof(BTLPeriodTrans))]
    public class BTLPeriodTrans
    {

        public int SNo { get; set; }
        public int BTLMasterSNo { get; set; }
        public int NoOfDays { get; set; }
        public int NoOfShipment { get; set; }
        public int TotalWeight { get; set; }
        public int CommoditySNo { get; set; }
        public int SPHCSNo { get; set; }
    }
}