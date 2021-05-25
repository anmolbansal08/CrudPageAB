﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
  
    [System.Runtime.Serialization.KnownType(typeof(DiscrepancyReportRequestModel))]
    public class DiscrepancyReportRequestModel
    {
        public string AirlineCode { get; set; }
        //public string FlightNo { get; set; }        
        //public string OriginSNo { get; set; }
        public string DestinationAirportCode { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }        
        //public string AWBNo { get; set; }
    }


    [System.Runtime.Serialization.KnownType(typeof(DiscrepancyReport))]
    public class DiscrepancyReport
    {
        //Flight No. 	Flight Date	MAWB	HAWB	Manifested Pcs	Manifested G Wt.	Receive Pcs	Receive G Wt.

        public int SNo { get; set; }
        public string Org { get; set; }
        public string Dest { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string MAWB { get; set; }
        public string HAWB { get; set; }
        public string ManifestedPcs { get; set; }
        public string ManifestedGWt { get; set; }
        public string ReceivePcs { get; set; }
        public string ReceiveGWt { get; set; }
    }
}
