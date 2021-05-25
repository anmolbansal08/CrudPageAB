using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    #region ULD Breakdown Description
    /*
	*****************************************************************************
	Class Name:		ULD Breakdown   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		23 Oct 2015
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(ULDBreakdown))]
    public class ULDBreakdown
    {
        public int SNo { get; set; }
        //public String ULDType { get; set; }
        //public String ULDNumber { get; set; }
        //public String ULDLocation { get; set; }
        //public String ULDBuildWeight { get; set; }
        //public String TareWeight { get; set; }
        //public String Action { get; set; }
        //public String HdnAction { get; set; }


        public String AWBNo { get; set; }
        public String TotalandPlannedPcs { get; set; }
        public String TotalandPlannedGrwt { get; set; }
        public String TotalandPlannedVolwt { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public String WHLocation { get; set; }
        public String HdnWHLocation { get; set; }
        public String RequestedBy { get; set; }
        public String HdnRequestedBy { get; set; }
        public String BilledTo { get; set; }
        public String HdnBilledTo { get; set; }
        public String MainULDNo { get; set; }
        public String DailFlightSNo { get; set; }
        public String Remove { get; set; }
    }

    [KnownType(typeof(LyingBuildup))]
    public class LyingBuildup
    {
        public Int64 SNo { get; set; }
        public Int64 AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string OriginCity { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public int LoadPieces { get; set; }
        public decimal LoadGrossWeight { get; set; }
        public decimal LoadVol { get; set; }
        public string SPHC { get; set; }
        public int LIPieces { get; set; }
        //public string Commodity { get; set; }
        public string Plan { get; set; }
        public int FromTable { get; set; }
        public int FromTableSNo { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string ShipmentDetail { get; set; }
        public string WeightDetail { get; set; }
        public string LoadDetail { get; set; }
        public string AWBPieces { get; set; }
        public string AWBGrossWeight { get; set; }
        public string AWBVolumeWeight { get; set; }
        //AWBSno: crowdata.AWBSno,
        //                AwbNo: crowdata.AwbNo,
        //                Pieces: crowdata.Pieces,
        //                GrossWeight: crowdata.GrossWeight,
        //                VolumeWeight: crowdata.VolumeWeight,
        //                SPHC: crowdata.SPHC,
        //                ULDStockSNo: 0,
        //                FromTable: crowdata.FromTable,
        //                FromTableSNo: crowdata.FromTableSNo

    }

    [KnownType(typeof(ULDBreakdownArray))]
    public class ULDBreakdownArray
    {
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string OffloadedSNo { get; set; }
    }
}
