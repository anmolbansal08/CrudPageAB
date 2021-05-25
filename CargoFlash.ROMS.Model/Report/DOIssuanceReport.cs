using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   
    [System.Runtime.Serialization.KnownType(typeof(DOIssuanceReportRequestModel))]
    public class DOIssuanceReportRequestModel
    {
        public string AirlineCode { get; set; }
        //public string Airport { get; set; }
        //public string FlightNo { get; set; }
        public string OriginCode { get; set; }
        //public string DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        //public string AWBNo { get; set; }
    }


    [System.Runtime.Serialization.KnownType(typeof(DOIssuanceReport))]
    public class DOIssuanceReport
    {
        ////S No.	DONo	MAWBNo.	HAWBNo.	Pcs.	GWt.		CreatedBy	CreatedOn

        public int SNo { get; set; }
        //public string Org { get; set; }
        //public string Dest { get; set; }
        public string DONo { get; set; }
        public string MAWBNo { get; set; }
        public string HAWBNo { get; set; }
        public string Pcs { get; set; }
        public string GWt { get; set; }
        public string Origin { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
    }
}
