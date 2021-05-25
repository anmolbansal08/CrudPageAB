using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.RFS
{
    [KnownType(typeof(RFSModel))]
    public class RFSModel
    {
        public int SNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public string ProcessStatus { get; set; }
        public string ETA { get; set; }
        public string ETD { get; set; }
        public string Status { get; set; }
        public int TruckSource { get; set; }
        public int AccountSNo { get; set; }
        public string IsTruckAgentOrVendor { get; set; }
        public string AgendOrVendorName { get; set; }
        public string SealNo { get; set; }
        public string TruckNo { get; set; }
        public DateTime? TruckDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string TruckSNo { get; set; }
        public string TruckType { get; set; }
        public int IsTruck { get; set; }
        public int IsAssignFlight { get; set; }
        public int IsManifested { get; set; }
        public int IsCharges { get; set; }
        public int IsDeparted { get; set; }
        public int ChargesCalculatedManually { get; set; }
        public string ChargesRemarks { get; set; }
        public string TruckLocation { get; set; }
        public int IsRFSCancelled { get; set; }
        public string TruckSourceDetails { get; set; }
    }

    [KnownType(typeof(ManifestULD))]
    public class ManifestULD
    {
        public Int32 ULDStockSNo { get; set; }
        public Int32 Pieces { get; set; }
        public decimal MaxVolumeWeight { get; set; }
        public decimal MaxGrossWeight { get; set; }
        public string EmptyWeight { get; set; }
        public string ULDNo { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public Int32 DailyFlightSNo { get; set; }
        public string Status { get; set; }
        public Int32 Shipments { get; set; }
        public Int16 isSelect { get; set; }
        public string HoldShip { get; set; }
        public bool IsDisabledULD { get; set; }
        public string RFSRemarks { get; set; }
    }

    [KnownType(typeof(ManifestShipment))]
    public class ManifestShipment
    {
        public Int32 ULDStockSNo { get; set; }
        public Int16 IsBulk { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public string ProcessStatus { get; set; }
        public Int64 AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string AWBSector { get; set; }
        public decimal TotalPieces { get; set; }
        public decimal OLCPieces { get; set; }
        public Int64 PlannedPieces { get; set; }
        public string ActG_V_CBM { get; set; }
        public string PlanG_V_CBM { get; set; }
        public string Status { get; set; }
        public string Commodity { get; set; }
        public string SHC { get; set; }
        public string Agent { get; set; }
        public decimal PG { get; set; }
        public decimal PV { get; set; }
        public decimal PCBM { get; set; }
        public bool isSelect { get; set; }
        public string Priority { get; set; }
        public string ULDGroupNo { get; set; }
        public string ULDType { get; set; }
        public bool isPayment { get; set; }
        public bool isHold { get; set; }
        public Int64 TotalPPcs { get; set; }
        public bool IsPreManifested { get; set; }
        public string RFSRemarks { get; set; }
        public string ChargeCSS { get; set; }
        public bool IsCTM { get; set; }
        public int CTMSNo { get; set; }
        public string ChargesRemarks { get; set; }
    }

    [KnownType(typeof(TruckDetails))]
    public class TruckDetails
    {
        public int DailyFlightSNo { get; set; }
        public String AccountSNo { get; set; }
        public decimal HiringCharges { get; set; }
        public int DestinationAirportSNo { get; set; }
        public String DriverID { get; set; }
        public String DriverMasterSNo { get; set; }
        public string DriverName { get; set; }
        public String ETA { get; set; }
        public String ETD { get; set; }
        public string MobileNo { get; set; }
        public int OriginAirportSNo { get; set; }
        public decimal TruckCapacity { get; set; }
        public string TruckDate { get; set; }
        public string TruckNo { get; set; }
        public int AircraftSNo { get; set; }
        //public int AircraftInventorySNo { get; set; }
        public String TruckRegistrationNo { get; set; }
        public String SASTruckRegistrationNoSNo { get; set; }
        public String SASTruckRegistrationNo { get; set; }
        public String TruckSource { get; set; }
        public String AgendOrVendorName { get; set; }
        public String ScheduleTrip { get; set; }
        public String Location { get; set; }
    }

    [KnownType(typeof(TruckRFSHistoryDetails))]
    public class TruckRFSHistoryDetails
    {
        public String DriverID { get; set; }
        public string DriverName { get; set; }
        public string MobileNo { get; set; }
        public String TruckRegistrationNo { get; set; }
        public string Remarks { get; set; }
        public int TruckTypeSNo { get; set; }
        public string Location { get; set; }
        public String ScheduleTrip { get; set; }
    }


    [KnownType(typeof(AssignFlightDetails))]
    public class AssignFlightDetails
    {
        public int RFSTruckDetailsSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public string AssignFlightNo { get; set; }
        public string AssignFlightDate { get; set; }
        public decimal CalculatedPosition { get; set; }
        public decimal ChargeableUnit { get; set; }
        public decimal ULDCount { get; set; }
        public decimal MinULDCount { get; set; }
        public int IsBulkCount { get; set; }
        public int IsULDCount { get; set; }
        public decimal IsMinBulkCount { get; set; }
        public decimal IsMinULDCount { get; set; }
    }

    [KnownType(typeof(DepartureDetails))]
    public class DepartureDetails
    {
        public string RFSTruckDetailsSNo { get; set; }
        public string DepartureDate { get; set; }
        public string ATD { get; set; }
        public string SealNo { get; set; }
        public string IPTANo { get; set; }
        public string SealPersonName { get; set; }
        //public string RFSMovementNo { get; set; }
        public string DRemarks { get; set; }
        public string DelayRemarks { get; set; }
    }

    [KnownType(typeof(RFSChargesModel))]
    public class RFSChargesModel
    {
        public string Airline { get; set; }
        public decimal NoOfUnits { get; set; }
        public decimal ChargeableUnit { get; set; }
        public decimal HdnChargeableUnit { get; set; }
        public int AirlineSNo { get; set; }
        public int RFSTruckDetailsSNo { get; set; }
        public decimal Rate { get; set; }
        public decimal HdnAmount { get; set; }
        public decimal Amount { get; set; }
        public string FreightRemarks { get; set; }
        public int RateAirlineMasterSNo { get; set; }
        public decimal HdnTotalAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal HdnTaxAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public string TaxType { get; set; }
        public string TruckRatesTax { get; set; }
    }

    [KnownType(typeof(RFSDockingChargesModel))]
    public class RFSDockingChargesModel
    {
        public int TariffSNo { get; set; }
        public string TariffHeadName { get; set; }
        public string TariffCode { get; set; }
        public decimal pValue { get; set; }
        public string PrimaryBasis { get; set; }
        public decimal sValue { get; set; }
        public string SecondaryBasis { get; set; }
        public decimal ChargeAmount { get; set; }
        public decimal TotalTaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string ChargeRemarks { get; set; }
    }

    [KnownType(typeof(RFSCustomChargesModel))]
    public class RFSCustomChargesModel
    {
        public int RFSTruckDetailsSNo { get; set; }
        public int AirlineSNo { get; set; }
        public string AirlineName { get; set; }
        public int RateAirlineCustomChargesSNo { get; set; }
        public string ChargeName { get; set; }
        public decimal Amount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal HdnTotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal HdnTaxAmount { get; set; }
        public string TaxType { get; set; }
        public string TruckRatesTax { get; set; }
        public int RateAirlineMasterSNo { get; set; }
    }

    [KnownType(typeof(RFSChargesDetails))]
    public class RFSChargesDetails
    {
        public int NoOfUnits { get; set; }
        public decimal ChargeableUnit { get; set; }
        public int AirlineSNo { get; set; }
        public int RFSTruckDetailsSNo { get; set; }
        public decimal Amount { get; set; }
        public string FreightRemarks { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public int RateAirlineMasterSNo { get; set; }
        public string TaxType { get; set; }
    }

    [KnownType(typeof(RFSCustomChargesDetails))]
    public class RFSCustomChargesDetails
    {
        public int RFSTruckDetailsSNo { get; set; }
        public int AirlineSNo { get; set; }
        public int RateAirlineCustomChargesSNo { get; set; }
        public decimal Amount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public int RateAirlineMasterSNo { get; set; }
        public string TaxType { get; set; }
        public string ChargeName { get; set; }
    }

    [KnownType(typeof(RFSHandlingCharges))]
    public class RFSHandlingCharges
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public int WaveOff { get; set; }
        //public int ChargeAirline { get; set; }
        public string TariffCodeSNo { get; set; }
        public string TariffHeadName { get; set; }
        public string pValue { get; set; }
        public string sValue { get; set; }
        public decimal Amount { get; set; }
        public decimal TotalTaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Rate { get; set; }
        public string Min { get; set; }
        public string Mode { get; set; }
        public string ChargeTo { get; set; }
        public int ChargeToSNo { get; set; }
        public string pBasis { get; set; }
        public string sBasis { get; set; }
        public string Remarks { get; set; }
        public string WaveoffRemarks { get; set; }
    }

    [KnownType(typeof(RFSShipmentInfo))]
    public class RFSShipmentInfo
    {
        public int PartNumber { get; set; }
        public int AWBSNo { get; set; }
        public int HAWBSNo { get; set; }
        public int PartSNo { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public int IsBUP { get; set; }
        public int SPHCSNo { get; set; }
        public int SPHCTransSNo { get; set; }
    }
}
