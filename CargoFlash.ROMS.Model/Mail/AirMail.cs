using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;


namespace CargoFlash.Cargo.Model.Mail
{
    [KnownType(typeof(AirMail))]
    public class AirMail
    {
        public string AirlineCode { get; set; }
        public int SNo { get; set; }
        public string CN38No { get; set; }
        public string AirportCode { get; set; }
        public int? IssuingAgent { get; set; }
        public string Text_IssuingAgent { get; set; }
        public string SPHC { get; set; }
        public string Text_SPHC { get; set; }
        public string MailCategory { get; set; }
        public string Text_MailCategory { get; set; }
        public string MailCategoryName { get; set; }
        public string MailHCCode { get; set; }
        public string Text_MailHCCode { get; set; }
        public string Description { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDest { get; set; }
        public string BoardPoint { get; set; }
        public string OffPoint { get; set; }
        public DateTime? FlightDate { get; set; }
        public string FlightNo { get; set; }
        public string PostCode { get; set; }
        public string PostBranch { get; set; }
        public int? TotalPieces { get; set; }
        public decimal? GrossWeight { get; set; }
        public decimal? CBM { get; set; }
        public decimal? ChargeableWeight { get; set; }
        public bool LocationRequired { get; set; }
        public bool AssignLocation { get; set; }
        public int? ULDTypeSNo { get; set; }
        public string ULDNo { get; set; }
        public DateTime? BookingDate { get; set; }
        public string SplitLoaded { get; set; }
        public string OwnerCode { get; set; }
        public int? StatusNo { get; set; }
        public string ProcessedStatus { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }


        /* add for Itenary* */
        public string ItineraryCarrierCode { get; set; }
        public string ItineraryDate { get; set; }
        public string ItineraryDestination { get; set; }
        public string ItineraryFlightNo { get; set; }
        public string ItineraryGrossWeight { get; set; }
        public string ItineraryOrigin { get; set; }

        public string ItineraryPieces { get; set; }
        public string ItineraryVolumeWeight { get; set; }
        public string Text_AirlineCode { get; set; }
        public string Text_ItineraryCarrierCode { get; set; }
        public string Text_ItineraryDestination { get; set; }
        //  public string Text_ItineraryFlightNo { get; set; }

        public string Text_ItineraryOrigin { get; set; }

        public string Text_UM { get; set; }
        public string UM { get; set; }
        public int MailNo { get; set; }
        public decimal? VolumnWeight { get; set; }
        public string Status { get; set; }
        public string ProcessStatus { get; set; }
        public string Type { get; set; }
    }

    [KnownType(typeof(AirMailCustomer))]
    public class AirMailCustomer
    {
        public int SNo { get; set; }
        public int POMailSNo { get; set; }
        public string SHIPPER_Name { get; set; }
        public string SHIPPER_Street { get; set; }
        public string SHIPPER_TownLocation { get; set; }
        public string SHIPPER_State { get; set; }
        public string SHIPPER_PostalCode { get; set; }
        public string SHIPPER_MobileNo { get; set; }
        public string SHIPPER_Email { get; set; }
        public string SHIPPER_CountryCode { get; set; }
        public string SHIPPER_City { get; set; }
        public string CONSIGNEE_AccountNoName { get; set; }
        public string CONSIGNEE_Street { get; set; }
        public string CONSIGNEE_TownLocation { get; set; }
        public string CONSIGNEE_State { get; set; }
        public string CONSIGNEE_PostalCode { get; set; }
        public string CONSIGNEE_MobileNo { get; set; }
        public string CONSIGNEE_Email { get; set; }
        public string CONSIGNEE_CountryCode { get; set; }
        public string CONSIGNEE_City { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }

        //public string  ShipperAccountNo { get; set; }
        //public string ConsigneeAccountNo { get; set; }
    }

    [KnownType(typeof(AirMailTransaction))]
    public class AirMailTransaction
    {
        public int SNo { get; set; }
        public int POMailSNo { get; set; }

        public string HdnOriCountryCode { get; set; }
        public string HdnOriCityCode { get; set; }
        public string HdnOriOEQualifier { get; set; }
        public string HdnDestCountryCode { get; set; }
        public string HdnDestCityCode { get; set; }
        public string HdnDestOEQualifier { get; set; }
        public string HdnMailCategory { get; set; }
        public string HdnMailSubCategory { get; set; }

        public string OriCountryCode { get; set; }
        public string OriCityCode { get; set; }
        public string OriOEQualifier { get; set; }
        public string DestCountryCode { get; set; }
        public string DestCityCode { get; set; }
        public string DestOEQualifier { get; set; }
        public string MailCategory { get; set; }
        public string MailSubCategory { get; set; }
        public string YearOfDispatch { get; set; }
        public string DNNo { get; set; }                       // Dispatch Number
        public string ReceptacleNumber { get; set; }           // BagID
        public string HNRIndicator { get; set; }               // Highest Number Receptacle Indicatior
        public string RIICode { get; set; }                    // Registered Insured Indicatior code
        public string ReceptacleWeight { get; set; }
        public string ULDStock { get; set; }
        public string HdnULDStock { get; set; }
    }

    [KnownType(typeof(DNFlightTransaction))]
    public class DNFlightTransaction
    {
        public string SNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
    }

    [KnownType(typeof(HandlingCharge))]
    public class HandlingCharge
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string WaveOff { get; set; }
        [Order(4)]
        public string TariffCodeSNo { get; set; }
        [Order(5)]
        public string TariffHeadName { get; set; }
        [Order(6)]
        public decimal pValue { get; set; }
        [Order(7)]
        public decimal sValue { get; set; }
        [Order(8)]
        public decimal Amount { get; set; }
        [Order(9)]
        public decimal Discount { get; set; }
        [Order(10)]
        public decimal DiscountPercent { get; set; }
        [Order(11)]
        public string Tax { get; set; }
        [Order(12)]
        public string TotalAmount { get; set; }
        [Order(13)]
        public string Rate { get; set; }
        [Order(14)]
        public string Min { get; set; }
        [Order(15)]
        public string Mode { get; set; }
        [Order(16)]
        public string ChargeTo { get; set; }
        [Order(17)]
        public string pBasis { get; set; }
        [Order(18)]
        public string sBasis { get; set; }
        [Order(19)]
        public string Remarks { get; set; }
        [Order(20)]
        public string WaveoffRemarks { get; set; }
        [Order(21)]
        public string DescriptionRemarks { get; set; }
        [Order(22)]
        public string TaxPercent { get; set; }

    }

    [KnownType(typeof(AWBCheque))]
    public class AWBCheque
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string BankSNo { get; set; }
        [Order(4)]
        public decimal Branch { get; set; }
        [Order(5)]
        public string ChequeNo { get; set; }
        [Order(6)]
        public string ChequeLimit { get; set; }
    }

    [KnownType(typeof(POMailInformation))]
    public class POMailInformation
    {
        // public string SNo { get; set; }
        public string CN38No { get; set; }
        public string AirlineCode { get; set; }
        public int IssuingAgent { get; set; }
        public string SPHC { get; set; }
        public int? MailCategory { get; set; }
        public int? MailHCCode { get; set; }
        public string Description { get; set; }
        public string ShipmentOrigin { get; set; }
        public string ShipmentDest { get; set; }
        public string PostCode { get; set; }
        public string PostBranch { get; set; }
        public int? TotalPieces { get; set; }
        public decimal? GrossWeight { get; set; }
        public decimal? CBM { get; set; }
        public decimal? ChargeableWeight { get; set; }
        public decimal? VolumeWeight { get; set; }
        public bool LocationRequired { get; set; }
        public int? ULDTypeSNo { get; set; }
        public bool ULDNo { get; set; }

        public int MailNo { get; set; }
        public int UM { get; set; }

    }
    [KnownType(typeof(AgentOtherCharge))]
    public class AgentOtherCharge
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string BookingRefNo { get; set; }
        public string Type { get; set; }
        public int HdnType { get; set; }
        public string OtherChargeCode { get; set; }
        public string OtherchargeDetail { get; set; }
        public string ChargeValue { get; set; }
        public string ReferenceNumber { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
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
        public string TaxAmount { get; set; }
        public string TotalTaxAmount { get; set; }
        public string ReferenceNo { get; set; }
        public string MarketRateTax { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(POMailItineraryInformation))]
    public class POMailItineraryInformation
    {
        public string SNo { get; set; }
        public string ReservationBookingSNo { get; set; }
        public string ReservationBookingRefNo { get; set; }
        public string AWBPieces { get; set; }
        public string AWBGrossWeight { get; set; }
        public string AWBVolumeWeight { get; set; }

        public string DailyFlightSNo { get; set; }
        public string CarrierCode { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }
        public string AircraftType { get; set; }
        public string FreeSpaceGrossWeight { get; set; }
        public string FreeSpaceVolumeWeight { get; set; }
        public string AllotmentCode { get; set; }
        public string AllocatedGrossWeight { get; set; }
        public string AllocatedVolumeWeight { get; set; }
        public string AvailableGrossWeight { get; set; }
        public string AvailableVolumeWeight { get; set; }

        public string SoftEmbargo
        {
            get;
            set;
        }


        public int? Allotmentsno { get; set; }
        public string MainVolumeWeight { get; set; }
    }

    [KnownType(typeof(ScannDn))]
    public class ScannDn
    {
        public string text_oricountrycode { get; set; }
        public string oricountrycode { get; set; }
        public string text_oricitycode { get; set; }
        public string oricitycode { get; set; }
        public string text_orioequalifier { get; set; }
        public string orioequalifier_SNo { get; set; }
        public string text_destcountrycode { get; set; }
        public string destcountrycode { get; set; }
        public string text_destcitycode { get; set; }
        public string destcitycode { get; set; }
        public string text_destoequalifier { get; set; }
        public string destoequalifier_SNo { get; set; }
        public string text_mailcategory { get; set; }
        public string mailcategory { get; set; }
        public string text_mailsubcategory { get; set; }

        public string mailsubcategory { get; set; }

        public string yearofdispatch { get; set; }
        public string dnno { get; set; }
        public string receptaclenumber { get; set; }
        public string hnrindicator { get; set; }
        public string riicode { get; set; }
        public string receptacleweight { get; set; }
    }

    public class CreateAirMailWhereCondition
    {
        public string AirMailSNo { get; set; }


    }
    public class SaveAtPaymentRequest
    {

        public string AirMailSNo { get; set; }
        public string TotalCash { get; set; }
        public string TotalCredit { get; set; }
        public List<HandlingCharge> lstHandlingCharge { get; set; }
        public List<AWBCheque> lstAWBCheque { get; set; }
        public string CityCode { get; set; }
        public int UpdatedBy { get; set; }
       
    }
}
