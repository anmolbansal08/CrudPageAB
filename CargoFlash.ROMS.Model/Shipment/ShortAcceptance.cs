using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
    #region Short Acceptance Description
    /*
	*****************************************************************************
	Class Name:		Short Acceptance   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		04 July 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(ShortAcceptance))]
    public class ShortAcceptance
    {
        public string AWBSNo { get; set; }
        public string AWBPrefix { get; set; }
        public string AWBNo { get; set; }
        public string AWBReferenceBookingSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string BookingType { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public Nullable<DateTime> BookingDate { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string AWBPieces { get; set; }
        public string GrossWeight { get; set; }
        public string Volume { get; set; }
        public string AWBStatus { get; set; }
        public string InternationalORDomestic { get; set; }
        public string FlightNo { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string BookingReleaseTime { get; set; }
        public string ShipmentStatus { get; set; }
        public string SplitLoaded { get; set; }
        public string AWBStatusNo { get; set; }
        public string IsCCA { get; set; }
    }

    [KnownType(typeof(ShortAcceptanceData))]
    public class ShortAcceptanceData
    {
        public string AWBSNo { get; set; }
        public string ProductSNo { get; set; }
        public string AccountSNo { get; set; }
        public string AWBPieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string ChargeableWeight { get; set; }
        public string Volume { get; set; }
        public string CommoditySNo { get; set; }
        public string NOG { get; set; }
        public string SPHC { get; set; }
    }
}
