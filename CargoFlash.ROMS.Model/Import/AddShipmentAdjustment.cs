using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(AddShipmentAdjustment))]
    public class AddShipmentAdjustment
    {
        public int SNo { get; set; }
        public string AirlineName { get; set; }
        public string AWBNo { get; set; }
        public string AWBOD { get; set; }
        public int AWBPieces { get; set; }
        //public string S1 { get; set; }
        //public string SP1 { get; set; }
        //public string S2 { get; set; }
        //public string SP2 { get; set; }
        //public string S3 { get; set; }
        //public string SP3 { get; set; }
        //public string S4 { get; set; }
        //public string SP4 { get; set; }
        //public string S5 { get; set; }
        //public string SP5 { get; set; }
        //public string Total { get; set; }
        //public string ExtraPieces { get; set; }
        public string ProcessStatus { get; set; }
    }

    [KnownType(typeof(GetAddShipmentAdjustmentGridFilter))]
    public class GetAddShipmentAdjustmentGridFilter
    {
        public string searchAWBSNo { get; set; }
        public string LoggedInCity { get; set; }
    }

    public class AddShipmentAdjustmentSearch
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string searchAWBSNo { get; set; }
    }
}
