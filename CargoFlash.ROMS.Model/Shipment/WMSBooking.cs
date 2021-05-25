using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

using System.ComponentModel;


namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(WMSBookingGridData))]
    public class WMSBookingGridData
    {
        public string ProcessStatus { get; set; }// Added By manoj Kumar on 2.7.2015
        public Int64 DailyFlightSNo { get; set; }//Added By Manoj Kumar on 3.7.2015
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string SLINo { get; set; }
        public string SLIStatus { get; set; }
        public Nullable<DateTime> AWBDate { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public decimal Gross { get; set; }
        public decimal Volume { get; set; }
        public decimal ChWt { get; set; }
        public int Pcs { get; set; }
        public string FWBPCSWT { get; set; }
        public string SLIPCSWT { get; set; }
        public string FlightNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        //public string FlightDate { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal FBLWt { get; set; }// Added by RH 12-08-15
        public decimal FWBWt { get; set; }// Added by RH 12-08-15
        public decimal RCSWt { get; set; }// Added by RH 12-08-15
        public string SPHC { get; set; }
        public string IsDirectAcceptance { get; set; }// Added by RH 19-01-17 for direct awb flag
        public string AdviceCode { get; set; }
        public string TerminalName { get; set; }
        public string TransactionType { get; set; }//added by jitendra kumar,12 july 2017
        public string InternationalORDomestic { get; set; }
        public string AccountTypeSNo { get; set; }//added by jitendra kumar,18 oct 2017
        public string InwardFlightNo   { get; set; }   //added by JJ FOR Transit Grid Filter
        public Nullable<DateTime> InwardFDate { get; set; }   //added by JJ FOR Transit Grid Filter
        public string OutwardFlightNo { get; set; }   //added by JJ FOR Transit Grid Filter
        public string OutwardFDate  { get; set; }   //added by JJ FOR Transit Grid Filter
        public string OutwardFlightSector     { get; set; }   //added by JJ FOR Transit Grid Filter
        public string InwardFlightSector { get; set; }        //added by JJ FOR Transit Grid Filter
        public string AWBReferenceNumber { get; set; }        //added by JJ FOR Transit Grid Filter

        public string TimeDifference { get; set; }        //added by JJ FOR Transit Grid Filter
        public string OriginAirportCode { get; set; }       //added by Tarun 05/01//18 
        public string DestinationAirportCode { get; set; }  //added by Tarun 05/01//18
        public string LateAWBHoldSNo { get; set; }  //added by akaram 25/05//18
        public string IsApprovedLateAWBHold { get; set; }  //added by akaram 25/05//18
		public Int64 SLISNo { get; set; }  //added by Tarun 10/07//18
		public string ETDANDETA { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string RECEIPTSNO { get; set; }
        public string WOSNO { get; set; }
        public string INVOICESNO { get; set; }
        public string AgentName { get; set; }
        public string Userid { get; set; }
        public string UserName { get; set; }
        public string AcceptanceTime { get; set; }
        public string AcceptanceDate { get; set; }

    }

    [KnownType(typeof(WMSTransitFWBGridData))]
    public class WMSTransitFWBGridData
    {
        public string ProcessStatus { get; set; }// Added By manoj Kumar on 2.7.2015
        public Int64 DailyFlightSNo { get; set; }//Added By Manoj Kumar on 3.7.2015
        public string AWBOD { get; set; }
        public string OperationalSector { get; set; }
        public string InwardFlightNo { get; set; }   //added by JJ FOR Transit Grid Filter
        public Nullable<DateTime> InwardFlightDate { get; set; }   //added by JJ FOR Transit Grid Filter
        public string OutwardFlightNo { get; set; }   //added by JJ FOR Transit Grid Filter
        public Nullable<DateTime> OutwardFlightDate { get; set; }   //added by JJ FOR Transit Grid Filter
        public string OutwardFlightSector { get; set; }   //added by JJ FOR Transit Grid Filter
        public string InwardFlightSector { get; set; }        //added by JJ FOR Transit Grid Filter
        public string AWBReferenceNumber { get; set; }        //added by JJ FOR Transit Grid Filter
        public string TimeDifference { get; set; }        //added by JJ FOR Transit Grid Filter 
        public int TransitPieces { get; set; }         //added by JJ FOR Transit Grid Filter 
        public decimal TransitGrWt { get; set; }         //added by JJ FOR Transit Grid Filter 
        public Int64 SNo { get; set; }
        public string AWBNo { get; set; }
        public string SLINo { get; set; }
        public string SLIStatus { get; set; }
        public Nullable<DateTime> AWBDate { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public decimal Gross { get; set; }
        public decimal Volume { get; set; }
        public decimal ChWt { get; set; }
        public int Pcs { get; set; }
        public string FWBPCSWT { get; set; }
        public string SLIPCSWT { get; set; }
        public string FlightNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        //public string FlightDate { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal FBLWt { get; set; }// Added by RH 12-08-15
        public decimal FWBWt { get; set; }// Added by RH 12-08-15
        public decimal RCSWt { get; set; }// Added by RH 12-08-15
        public string SPHC { get; set; }
        public string IsDirectAcceptance { get; set; }// Added by RH 19-01-17 for direct awb flag
        public string AdviceCode { get; set; }
        public string TerminalName { get; set; }
        public string TransactionType { get; set; }//added by jitendra kumar,12 july 2017
        public string InternationalORDomestic { get; set; }
        public string AccountTypeSNo { get; set; }//added by jitendra kumar,18 oct 2017

        public string Arrived { get; set; } // added by Panka Khanna


    }

    [KnownType(typeof(WMSHAWBGridData))]
    public class WMSHAWBGridData
    {
        public Int64 SNo { get; set; }
        public string HAWBNo { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
    }

    [KnownType(typeof(WMSShippingBillGridData))]
    public class WMSShippingBillGridData
    {
        public Int64 SNo { get; set; }
        public Int64 ShippingBillNo { get; set; }
        public string MessageType { get; set; }
        public string AWBNo { get; set; }
        public string AWBType { get; set; }
        public string LEONo { get; set; }
    }

    [KnownType(typeof(WMSCheckListGridData))]
    public class WMSCheckListGridData
    {
        public Int64 SNo { get; set; }
        public Int64 CheckListTypeSNo { get; set; }
        public string SrNo { get; set; }
        public string Description { get; set; }
        public string Y { get; set; }
        public string N { get; set; }
        public string NA { get; set; }
        public string Remarks { get; set; }
        public string Column1 { get; set; }
        public string Column2 { get; set; }
        public string Column3 { get; set; }
    }

    //-- RH 030815 starts
    [KnownType(typeof(WMSEDIGridData))]
    public class WMSEDIGridData
    {
        public string CarrierCode { get; set; }
        public string MessageType { get; set; }
        public string GeneratedXml { get; set; }
        public string AWBNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string FlightDate { get; set; }
        public string SentAddress { get; set; }
        public string UpdatedOn { get; set; }
    }
    //-- RH 030815 ends


    //Created by Vinay Yadav for FBL
    [KnownType(typeof(WMSBookingGridDataFBL))]
    public class WMSBookingGridDataFBL
    {
        public string ProcessStatus { get; set; }// Added By manoj Kumar on 2.7.2015
        public Int32 DailyFlightSNo { get; set; }//Added By Manoj Kumar on 3.7.2015
        public Int32 SNo { get; set; }
        public string AWBNo { get; set; }
        public int SLINo { get; set; }
        public Nullable<DateTime> AWBDate { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDestination { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public decimal Gross { get; set; }
        public decimal Volume { get; set; }
        public decimal ChWt { get; set; }
        public int Pcs { get; set; }
        public string FlightNo { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public string ProductName { get; set; }
        public string CommodityCode { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string HandlingInfo { get; set; }
        public string XRay { get; set; }
        public string Payment { get; set; }
        public string Location { get; set; }
        public string Dimension { get; set; }
        public string Weight { get; set; }
        public string Reservation { get; set; }
        public string HAWB { get; set; }
        public string ShippingBill { get; set; }
        public string Document { get; set; }
        public string NoOfHouse { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
        public string WarningRemarks { get; set; }
        public bool IsWarning { get; set; }
        public decimal FBLWt { get; set; }// Added by RH 12-08-15
        public decimal FWBWt { get; set; }// Added by RH 12-08-15
        public decimal RCSWt { get; set; }// Added by RH 12-08-15
        public Nullable<DateTime> FlightDateSearch { get; set; } //Added by Vinay for FBL
    }
    //end

    [KnownType(typeof(DIMSGridDataFBL))]
    public class DIMSGridDataFBL
    {
        public int Pieces { get; set; }
        public decimal Weight { get; set; }
        public decimal Length { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public string cms { get; set; }
    }
}