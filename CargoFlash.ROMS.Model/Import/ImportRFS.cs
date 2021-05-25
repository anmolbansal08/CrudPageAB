using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(ImportRFSModel))]
    public class ImportRFSModel
    {
        public int SNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public string ProcessStatus { get; set; }
        public string ATA { get; set; }
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
        public int IsRFSCancelled { get; set; }
        public string TruckSourceDetails { get; set; }
    }

    [KnownType(typeof(ImportTruckDetails))]
    public class ImportTruckDetails
    {
        public int DailyFlightSNo { get; set; }
        public String AccountSNo { get; set; }
        public decimal HiringCharges { get; set; }
        public int DestinationAirportSNo { get; set; }
        public String DriverID { get; set; }
        public String DriverMasterSNo { get; set; }
        public String DriverName { get; set; }
        public String ATA { get; set; }
        public String MobileNo { get; set; }
        public int OriginAirportSNo { get; set; }
        public decimal TruckCapacity { get; set; }
        public String TruckDate { get; set; }
        public String TruckNo { get; set; }
        public int AircraftSNo { get; set; }
        public String TruckRegistrationNo { get; set; }
        public String SASTruckRegistrationNoSNo { get; set; }
        public String SASTruckRegistrationNo { get; set; }
        public String TruckSource { get; set; }
        public String AgendOrVendorName { get; set; }
        public String IPTANo { get; set; }
        public String CSLNo { get; set; }
        public String Remarks { get; set; }
        public String ScheduleTrip { get; set; }
        public String Location { get; set; }
        public decimal ManifestedGrWt { get; set; }
        //public decimal ActualManifestedGrWt { get; set; }
    }

    [KnownType(typeof(ImportRFSShipmentInfo))]
    public class ImportRFSShipmentInfo
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

    [KnownType(typeof(AssignFlightDetails))]
    public class AssignFlightDetails
    {
        public int RFSTruckDetailsSNo { get; set; }
        public int DailyFlightSNo { get; set; }
        public string AssignFlightNo { get; set; }
        public string AssignFlightDate { get; set; }
        public int OriginAirportSNo { get; set; }
        public string OriginAirportCode { get; set; }
        public int DestinationAirPortSNo { get; set; }
        public string DestinationAirportCode { get; set; }
        public int IsULDCount { get; set; }
        public int IsBulkCount { get; set; }
        public decimal EmptyStackPosition { get; set; }
        public decimal ULDPosition { get; set; }
        public decimal ULDGrossWeight { get; set; }
        public decimal BulkPosition { get; set; }
        public decimal BulkGrossWeight { get; set; }
        public decimal CalculatedPosition { get; set; }
        public decimal CalculatedGrossWeight { get; set; }
    }
}
