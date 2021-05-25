using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(UwsPrint))]
    public class UwsPrint
    {
        public int FlightSNo { get; set; }
        public DateTime FlightDate { get; set; }
    }

    [KnownType(typeof(UwsPrint))]
    public class UwsPrintGridData
    {
        public string DFSNo { get; set; }
        public Int32 FlightSNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string ETDETA { get; set; }
        public string Origin { get; set; }
        public string Dest { get; set; }
        public string Atype { get; set; }
        public string Route { get; set; }
        public string TCapacity { get; set; }
        public string ACapacity { get; set; }
        public string UCapacity { get; set; }
        public string FStatus { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public int FSNo { get; set; }
        public string Text_FSNo { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }

    }

    [KnownType(typeof(UPrintGridData))]
    public class UPrintGridData
    {
        public string FlightSNo { get; set; }
        public string AWBNo { get; set; }
        public bool FCheck { get; set; }
        public string AcceptTime { get; set; }
        public string TotalPic { get; set; }
        public string PlanPic { get; set; }
        public string TotGrWt { get; set; }
        public string PlanGrWt { get; set; }
        public string TotVolWt { get; set; }
        public string PlanVolWt { get; set; }
        public string AWBStatus { get; set; }
        public string AWBOrigin { get; set; }
        public string AWBDest { get; set; }
        public string Transit { get; set; }
        public string Yield { get; set; }
        public string SPHC { get; set; }
        public string NatureGood { get; set; }
        public string FlightDate { get; set; }
        public string OASNO { get; set; }
        public string DASNo { get; set; }
        public string HdnFlightNo { get; set; }
        public string FlightNo { get; set; }
        public string ADD { get; set; }

    }
}
