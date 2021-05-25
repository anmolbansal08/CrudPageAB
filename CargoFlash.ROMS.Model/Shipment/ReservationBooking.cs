using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
    #region Reservation Description
    /*
	*****************************************************************************
	Class Name:		Reservation   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		03 Jan 2017
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(ReservationGridData))]
    public class ReservationGridData
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
        public string ReplanComplete { get; set; }
        public string IsGoShowAccountType { get; set; }
        public string IsGoShowProduct { get; set; }
        public string ProcessStatus { get; set; }
        public string IsEDoxUploaded { get; set; }
        public string ApproveCancelShipment { get; set; }
        public string AcceptanceCutOffTime { get; set; }
        public string FlightDateString { get; set; }
        public string BookingDateString { get; set; }
        public string OrgAirportCode { get; set; }
        public string DesAirportCode { get; set; }
        public string BookingStatus { get; set; }
        public string NoofReplan { get; set; }
        public string NoOfREExecuted { get; set; }
        public string AccountNoofReplan { get; set; }
        public string AWBStockType { get; set; }
        public string ETDETA { get; set; }
        public string CreatedByUser { get; set; }
    }

    [KnownType(typeof(ReservationBooking))]
    public class ReservationBooking
    {
        public int SNo { get; set; }
    }

    [KnownType(typeof(DimensionTab))]
    public class DimensionTab
    {
        public int SNo { get; set; }
        public int BookingRefSNo { get; set; }
        public string BookingRefNo { get; set; }
        public int Pieces { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal Volume { get; set; }
        public int IsCMS { get; set; }
        public string CMS { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(DimensionULDTab))]
    public class DimensionULDTab
    {
        public int SNo { get; set; }
        public int BookingRefSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string ULDTypeSNo { get; set; }
        public int HdnULDTypeSNo { get; set; }
        public string ULDNo { get; set; }
        public string OwnerCode { get; set; }
        public int SLAC { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Pieces { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal Volume { get; set; }
        public int IsCMS { get; set; }
        public string CMS { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(DueCarrierOtherCharge))]
    public class DueCarrierOtherCharge
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string Type { get; set; }
        public string OtherChargeCode { get; set; }
        public string OtherchargeDetail { get; set; }
        public string ChargeValue { get; set; }
        public string OtherchargeCurrency { get; set; }
        public string ReferenceNumber { get; set; }
        public string ConvertedChargeValue { get; set; }
        public string ConvertedCurrencyCode { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string ChargeType { get; set; }

    }

    [KnownType(typeof(AgentOtherCharge))]
    public class AgentOtherCharge
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string Type { get; set; }
        public int HdnType { get; set; }
        public string OtherChargeType { get; set; }
        public string OtherChargeCode { get; set; }
        public string OtherchargeDetail { get; set; }
        public string AgentOtherchargeCurrency { get; set; }
        public string HdnAgentOtherchargeCurrency { get; set; }
        public string ReferenceNumber { get; set; }
        public string ChargeValue { get; set; }
        public string ConvertedChargeValue { get; set; }
        public string ConvertedCurrencyCode { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string ChargeType { get; set; }
    }

    [KnownType(typeof(TaxChargeInformation))]
    public class TaxChargeInformation
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string TaxCode { get; set; }
        public string TaxName { get; set; }
        public string TaxType { get; set; }
        public string TaxApplicable { get; set; }
        public string TaxRate { get; set; }
        public string TaxCurrency { get; set; }
        public string TaxAmount { get; set; }
        public string TotalTaxAmount { get; set; }
        public string MarketRateTax { get; set; }
        public string ReferenceNumber { get; set; }
        public string ConvertedChargeValue { get; set; }
        public string ConvertedCurrencyCode { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(ReservationItineraryInformation))]
    public class ReservationItineraryInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string AWBPieces
        {
            get;
            set;
        }
        public string AWBGrossWeight
        {
            get;
            set;
        }
        public string AWBVolumeWeight
        {
            get;
            set;
        }
        public string UM
        {
            get;
            set;
        }
        public string DailyFlightSNo
        {
            get;
            set;
        }
        public string CarrierCode
        {
            get;
            set;
        }
        public string FlightNo
        {
            get;
            set;
        }
        public string FlightDate
        {
            get;
            set;
        }
        public string Origin
        {
            get;
            set;
        }
        public string Destination
        {
            get;
            set;
        }
        public string Pieces
        {
            get;
            set;
        }
        public string GrossWeight
        {
            get;
            set;
        }
        public string VolumeWeight
        {
            get;
            set;
        }
        public string ETD
        {
            get;
            set;
        }
        public string ETA
        {
            get;
            set;
        }
        public string AircraftType
        {
            get;
            set;
        }
        public string FreeSpaceGrossWeight
        {
            get;
            set;
        }
        public string FreeSpaceVolumeWeight
        {
            get;
            set;
        }
        public string AllotmentCode
        {
            get;
            set;
        }
        public string AllocatedGrossWeight
        {
            get;
            set;
        }
        public string AllocatedVolumeWeight
        {
            get;
            set;
        }
        public string AvailableGrossWeight
        {
            get;
            set;
        }
        public string AvailableVolumeWeight
        {
            get;
            set;
        }
        public string SoftEmbargo
        {
            get;
            set;
        }
        public string FlightVolumeWeight
        {
            get;
            set;
        }
        public string OriginAirportSNo { get; set; }
        public string DestinationAirportSNo { get; set; }
        public string IsBCT { get; set; }
        public string IsMCT { get; set; }
    }

    [KnownType(typeof(ReservationInformation))]
    public class ReservationInformation
    {
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string BookingType
        {
            get;
            set;
        }
        public string AWBStock
        {
            get;
            set;
        }
        public string AWBPrefix
        {
            get;
            set;
        }
        public string AWBNo
        {
            get;
            set;
        }
        public string PaymentType
        {
            get;
            set;
        }
        public string IsBUP
        {
            get;
            set;
        }
        public string BupPieces
        {
            get;
            set;
        }
        public string BupIntactPieces
        {
            get;
            set;
        }
        public string ProductSNo
        {
            get;
            set;
        }
        public string OriginCitySNo
        {
            get;
            set;
        }
        public string DestinationCitySNo
        {
            get;
            set;
        }
        public string AccountSNo
        {
            get;
            set;
        }
        public string AWBPieces
        {
            get;
            set;
        }
        public string GrossWeight
        {
            get;
            set;
        }
        public string VolumeWeight
        {
            get;
            set;
        }
        public string ChargeableWeight
        {
            get;
            set;
        }
        public string Volume
        {
            get;
            set;
        }
        public string Priority
        {
            get;
            set;
        }
        public string UM
        {
            get;
            set;
        }
        public string CommoditySNo
        {
            get;
            set;
        }
        public string NOG
        {
            get;
            set;
        }
        public string SPHC
        {
            get;
            set;
        }
        public string NoofHouse
        {
            get;
            set;
        }
        public string IsRoutingComplete
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ReservationShipperInformation))]
    public class ReservationShipperInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string ShipperAccountNo
        {
            get;
            set;
        }
        public string ShipperName
        {
            get;
            set;
        }
        public string ShipperName2
        {
            get;
            set;
        }
        public string ShipperStreet
        {
            get;
            set;
        }
        public string ShipperStreet2
        {
            get;
            set;
        }
        public string ShipperLocation
        {
            get;
            set;
        }
        public string ShipperState
        {
            get;
            set;
        }
        public string ShipperPostalCode
        {
            get;
            set;
        }
        public string ShipperCity
        {
            get;
            set;
        }
        public string ShipperCountryCode
        {
            get;
            set;
        }
        public string ShipperMobile
        {
            get;
            set;
        }
        public string ShipperMobile2
        {
            get;
            set;
        }
        public string ShipperEMail
        {
            get;
            set;
        }
        public string ShipperFax
        {
            get;
            set;
        }
        public string ShipperGarudaMiles
        {
            get;
            set;
        }
       
    }

    [KnownType(typeof(ReservationConsigneeInformation))]
    public class ReservationConsigneeInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string ConsigneeAccountNo
        {
            get;
            set;
        }
        public string ConsigneeName
        {
            get;
            set;
        }
        public string ConsigneeName2
        {
            get;
            set;
        }
        public string ConsigneeStreet
        {
            get;
            set;
        }
        public string ConsigneeStreet2
        {
            get;
            set;
        }
        public string ConsigneeLocation
        {
            get;
            set;
        }
        public string ConsigneeState
        {
            get;
            set;
        }
        public string ConsigneePostalCode
        {
            get;
            set;
        }
        public string ConsigneeCity
        {
            get;
            set;
        }
        public string ConsigneeCountryCode
        {
            get;
            set;
        }
        public string ConsigneeMobile
        {
            get;
            set;
        }
        public string ConsigneeMobile2
        {
            get;
            set;
        }
        public string ConsigneeEMail
        {
            get;
            set;
        }
        public string ConsigneeFax
        {
            get;
            set;
        }
      
    }

    [KnownType(typeof(CustomsOtherInformationTab))]
    public class CustomsOtherInformationTab
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string BookingSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string OSI { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(CustomsOCIInformationTab))]
    public class CustomsOCIInformationTab
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string BookingSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string CountryCode { get; set; }
        public int HdnCountryCode { get; set; }
        public string InfoType { get; set; }
        public int HdnInfoType { get; set; }
        public string CSControlInfoIdentifire { get; set; }
        public int HdnCSControlInfoIdentifire { get; set; }
        public string SCSControlInfoIdentifire { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(ReservationDGRArray))]
    public class ReservationDGRArray
    {
        public string SPHCSNo { get; set; }
        public string SPHCCode { get; set; }
        public string DGRSNo { get; set; }
        public string UNNo { get; set; }
        public string DGRShipperSNo { get; set; }
        public string ProperShippingName { get; set; }
        public string Class { get; set; }
        public string SubRisk { get; set; }
        public string PackingGroup { get; set; }
        public string Pieces { get; set; }
        public string NetQuantity { get; set; }
        public string Unit { get; set; }
        public string Quantity { get; set; }
        public string PackingInst { get; set; }
        public string RAMCategory { get; set; }
        public string ERGN { get; set; }
        public string Commodity { get; set; }
    }

    [KnownType(typeof(ReservationSHCSubGroupArray))]
    public class ReservationSHCSubGroupArray
    {
        public int AWBSNo { get; set; }
        public int SHCSNo { get; set; }
        public string SubGroupSno { get; set; }
        public string MandatoryInfo { get; set; }
        public string PackingInst { get; set; }
    }

    [KnownType(typeof(ReservationAWBEDoxDetail))]
    public class ReservationAWBEDoxDetail
    {
        [Order(1)]
        public string EDoxdocumenttypeSNo { get; set; }
        [Order(2)]
        public string DocName { get; set; }
        [Order(3)]
        public string AltDocName { get; set; }
        [Order(4)]
        public string ReferenceNo { get; set; }
        [Order(5)]
        public string Remarks { get; set; }

    }

    [KnownType(typeof(ReservationSPHCDoxArray))]
    public class ReservationSPHCDoxArray
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string SPHCSNo { get; set; }
        [Order(4)]
        public string DocName { get; set; }
        [Order(5)]
        public string AltDocName { get; set; }
        [Order(6)]
        public string Remarks { get; set; }
    }

    [KnownType(typeof(ReservationChargeDeclarations))]
    public class ReservationChargeDeclarations
    {
        public string CVDCurrencyCode { get; set; }
        public string CVDChargeCode { get; set; }
        public string CVDWeightValuation
        {
            get;
            set;
        }
        public string CVDOtherCharges
        {
            get;
            set;
        }
        public string CVDDeclareCarriageValue
        {
            get;
            set;
        }
        public string CVDDeclareCustomValue
        {
            get;
            set;
        }
        public string CVDDeclareInsurenceValue
        {
            get;
            set;
        }
        public string CVDValuationCharge
        {
            get;
            set;
        }
        public string CDCCurrencyCode
        {
            get;
            set;
        }
        public string CDCCurrencyConversionRate
        {
            get;
            set;
        }
        public string CDCDestinationCurrencyCode
        {
            get;
            set;
        }
        public string CDCChargeAmount
        {
            get;
            set;
        }
        public string CDCTotalChargeAmount
        {
            get;
            set;
        }
    }

    [KnownType(typeof(CustomNotifyDetails))]
    public class CustomNotifyDetails
    {
        public string NotifyName
        {
            get;
            set;
        }
        public string NotifyName2
        {
            get;
            set;
        }
        public string NotifyCountryCode
        {
            get;
            set;
        }
        public string NotifyCityCode
        {
            get;
            set;
        }
        public string NotifyMobile
        {
            get;
            set;
        }
        public string NotifyMobile2
        {
            get;
            set;
        }
        public string NotifyAddress
        {
            get;
            set;
        }
        public string NotifyAddress2
        {
            get;
            set;
        }
        public string NotifyState
        {
            get;
            set;
        }
        public string NotifyPlace
        {
            get;
            set;
        }
        public string NotifyPostalCode
        {
            get;
            set;
        }
        public string NotifyFax
        {
            get;
            set;
        }
    }

    [KnownType(typeof(CustomNominyDetails))]
    public class CustomNominyDetails
    {
        public string NominyName
        {
            get;
            set;
        }
        public string NominyAddress
        {
            get;
            set;
        }

    }

    [KnownType(typeof(AWBSNoRequest))]
    public class AWBSNoRequest
    {
        public Int64? AWBSNo { get; set; }
    }

    [KnownType(typeof(ReservationGetWebForm))]
    public class ReservationGetWebForm
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string IsSubModule { get; set; }
    }

    [KnownType(typeof(ReservationGetGridData))]
    public class ReservationGetGridData
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string AWBPrefix { get; set; }
        public string AWBNo { get; set; }
        public string LoggedInCity { get; set; }
        public string ReferenceNo { get; set; }
        public string OriginAirport { get; set; }
        public string DestinationAirport { get; set; }
        public string AWBStatus { get; set; }
    }

    [KnownType(typeof(GetReservationGridData))]
    public class GetReservationGridData
    {
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string AWBPrefix { get; set; }
        public string AWBNo { get; set; }
        public string LoggedInCity { get; set; }
        public string ReferenceNo { get; set; }
        public string OriginAirport { get; set; }
        public string DestinationAirport { get; set; }
        public string AWBStatus { get; set; }
    }

    public class GetMarineInsuranceData
    {
        public int SNo { get; set; }
        public string AWBReferenceBookingSNo { get; set; }
        public string AWBSNo { get; set; }
        public string NoofCertificate { get; set; }
        public string Pieces { get; set; }
        public string Weight { get; set; }
        public string NOG { get; set; }
        public string CommoditySNo { get; set; }
        public string Category { get; set; }
        public string Declvalueforcarraige { get; set; }
        public string HAWBNo { get; set; }
        public string PremiumRate { get; set; }
        public string PremiumAmount { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string CountOfCertificate { get; set; }

    }
    [KnownType(typeof(CustomBillingDetails))]
    public class CustomBillingDetails
    {
        public string CustomerBillingName
        {
            get;
            set;
        }
       
        public string CustomerBillingCountryCode
        {
            get;
            set;
        }
        public string CustomerBillingCityCode
        {
            get;
            set;
        }
        public string CustomerBillingMobileNo
        {
            get;
            set;
        }
        public string CustomerBillingAddress
        {
            get;
            set;
        }
        public string CustomerBilling_Town
        {
            get;
            set;
        }
        public string CustomerBillingState
        {
            get;
            set;
        }
      
        public string CustomerBillingPostalCode
        {
            get;
            set;
        }
      
    }

}


