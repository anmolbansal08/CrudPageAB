using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(ReservationVSCRAComparision))]
    public class ReservationVSCRAComparision
    {
        public int SNo { get; set; }
        public string ResAWBTransfer { get; set; }
        public string ResPOSTransfer { get; set; }
        public string ResCCATransfer { get; set; }
        public string ResAWBNotTransfer { get; set; }
        public string ResPOSNotTransfer { get; set; }
        public string ResCCANotTransfer { get; set; }
        public string ResAWBFailed { get; set; }
        public string ResPOSFailed { get; set; }
        public string CRAAWBTransfer { get; set; }
        public string CRAPOSTransfer { get; set; }
        public string CRACCATransfer { get; set; }



        public string TotalRESTransfer { get; set; }
        public string TotalRESNotTransfer { get; set; }
        public string TotalRESFailed { get; set; }
        public string TotalCRATransfer { get; set; }
    }




    [KnownType(typeof(ShowAWBDetails))]
    public class ShowAWBDetails
    {
        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
        public string TotalCBM { get; set; }
        public string TotalChargeableWeight { get; set; }       
    }
}
