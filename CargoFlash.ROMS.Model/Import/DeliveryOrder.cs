using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(DeliveryOrder))]
    public class DeliveryOrder
    {
        public int SNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public String Airline { get; set; }
        public String FlightNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public String AWBNo { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public int Pcs { get; set; }
        public Int64 ArrivedShipmentSNo { get; set; }
        public String ATA { get; set; }
        public String ProcessStatus { get; set; }
        public String EnteredType { get; set; }
        public bool IsWarning { get; set; }
        public string WarningRemarks { get; set; }
        public int POMailSNo { get; set; }
        public string CargoMailCourier { get; set; }
    }

    public class CustomReferneceNumber
    {
        public int AWBSNo { get; set; }
        public string IsCustomVerification { get; set; }
        public string CustomReferenceNo { get; set; }
        public DateTime CutomReferenceDate { get; set; }
        public bool Ispomail { get; set; }
        public List<CustomReferneceNumber> lstCustomReference { get; set; }
    }

    [KnownType(typeof(GetDimemsionsAndULDNew))]
    public class GetDimemsionsAndULDNew
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int HAWBSNo { get; set; }
        public int NoOfPieces { get; set; }
        public string WeightCode { get; set; }
        public Nullable<Decimal> GrossWeight { get; set; }
        public string RateClassCode { get; set; }
        public string HdnRateClassCode { get; set; }
        public int CommodityItemNumber { get; set; }
        public Nullable<Decimal> ChargeableWeight { get; set; }
        public Nullable<Decimal> Charge { get; set; }
        public Nullable<Decimal> ChargeAmount { get; set; }
        public string NatureOfGoods { get; set; }
        public string hdnChildData { get; set; }
    }

    [KnownType(typeof(GetDimemsionsAndULDRate))]
    public class GetDimemsionsAndULDRate
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public string WeightCode { get; set; }
        public string RateClassCode { get; set; }
        public string HdnRateClassCode { get; set; }
        public int SLAC { get; set; }
        public int HdnULD { get; set; }
        public string ULD { get; set; }
        public string ULDNo { get; set; }
        public Nullable<Decimal> Charge { get; set; }
        public Nullable<Decimal> ChargeAmount { get; set; }
        public int HarmonisedCommodityCode { get; set; }
        public int HdnCountry { get; set; }
        public string Country { get; set; }
        public string NatureOfGoods { get; set; }
    }

    [KnownType(typeof(GetAWBOtherChargeData))]
    public class GetAWBOtherChargeData
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public string Type { get; set; }
        public string OtherCharge { get; set; }
        public string HdnOtherCharge { get; set; }
        public string DueType { get; set; }
        public Nullable<Decimal> Amount { get; set; }
    }

    [KnownType(typeof(ImportShipmentInformation))]
    public class ImportShipmentInformation
    {
        public string IsCourier { get; set; }
        public string ShowSlacDetails { get; set; }
        public string AWBNo { get; set; }
        public string AgentBranchSNo { get; set; }
        public string AWBTotalPieces { get; set; }
        public string CommoditySubGroupSNo { get; set; }
        public string CommoditySNo { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string ChargeableWeight { get; set; }
        public string Pieces { get; set; }
        public string ProductSNo { get; set; }
        public string IsPrepaid { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string XRayRequired { get; set; }
        public string NoOfHouse { get; set; }
        public string HouseFeededBy { get; set; }
        public string AWBDate { get; set; }
        public string NatureOfGoods { get; set; }
        public string IsBup { get; set; }
        public string buptypeSNo { get; set; }
        public string DensityGroupSNo { get; set; }
    }

    [KnownType(typeof(ImportAWBSPHC))]
    public class ImportAWBSPHC
    {
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string SPHCCode { get; set; }
    }

    [KnownType(typeof(ImportItineraryInformation))]
    public class ImportItineraryInformation
    {
        public string DailyFlightSNo { get; set; }
        public string BoardPoint { get; set; }
        public string OffPoint { get; set; }
        public string FlightDate { get; set; }
        public string FlightNo { get; set; }


    }

    [KnownType(typeof(ImportAWBSPHCTrans))]
    public class ImportAWBSPHCTrans
    {
        public string SNo
        {
            get;
            set;
        }
        public string AWBSNo
        {
            get;
            set;
        }
        public string AWBNo
        {
            get;
            set;
        }
        public string SPHCCode
        {
            get;
            set;
        }
        public string UNNo
        {
            get;
            set;
        }
        public string SPHCClassSNo
        {
            get;
            set;
        }
        public string HAWBSNo
        {
            get;
            set;
        }
        public string IsRadioActive
        {
            get;
            set;
        }
        public string MCBookingSNo
        {
            get;
            set;
        }
        public string SubRisk
        {
            get;
            set;
        }
        public string RamCat
        {
            get;
            set;
        }
        public string UnPackingGroupImpCode
        {
            get;
            set;
        }
        public string CaoX
        {
            get;
            set;
        }
        public string ImpCode
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ImportDimensionsArray))]
    public class ImportDimensionsArray
    {
        public string AWBSNo { get; set; }
        public string Charge { get; set; }
        public string ChargeAmount { get; set; }
        public string ChargeableWeight { get; set; }
        public string CommodityItemNumber { get; set; }
        public string Dimension { get; set; }
        public string GrossWeight { get; set; }
        public string NatureOfGoods { get; set; }
        public string NoOfPieces { get; set; }
        public string RateClassCode { get; set; }
        public string SNo { get; set; }
        public string WeightCode { get; set; }
        public string hdnChildData { get; set; }
    }

    [KnownType(typeof(ImportULDDimensionsArray))]
    public class ImportULDDimensionsArray
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string ChargeLineCount { get; set; }
        public string WeightCode { get; set; }
        public string RateClassCode { get; set; }
        public string HdnRateClassCode { get; set; }
        public string SLAC { get; set; }
        public string ULD { get; set; }
        public string HdnULD { get; set; }
        public string ULDNo { get; set; }
        public string Charge { get; set; }
        public string ChargeAmount { get; set; }
        public string HarmonisedCommodityCode { get; set; }
        public string Country { get; set; }
        public string HdnCountry { get; set; }
        public string NatureOfGoods { get; set; }
    }

    [KnownType(typeof(ImportAWBRateArray))]
    public class ImportAWBRateArray
    {
        public string AWBCurrencySNo { get; set; }
        public string CVDCurrency { get; set; }
        public string CVDChargeCode { get; set; }
        public string CVDWeightValuation { get; set; }
        public string CVDOtherCharges { get; set; }
        public string CVDDCarriageValue { get; set; }
        public string CVDCustomValue { get; set; }
        public string CVDInsurence { get; set; }
        public string CVDValuationCharge { get; set; }
        public string CDCCurrency { get; set; }
        public string CDCConversionRate { get; set; }
        public string CDCDestCurrency { get; set; }
        public string CDCChargeAmount { get; set; }
        public string CDCTotalCharAmount { get; set; }
    }

    [KnownType(typeof(ImportChildData))]
    public class ImportChildData
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string Length { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
        public string MeasurementUnitCode { get; set; }
        public string Pieces { get; set; }
        public string VolumeWeight { get; set; }
        public string VolumeUnit { get; set; }
        public string AWBRateDescriptionSNo { get; set; }
    }

    [KnownType(typeof(ImportShipperInformation))]
    public class ImportShipperInformation
    {
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
        public string ShipperStreet
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
        public string ShipperName2 { get; set; }
        public string ShipperStreet2 { get; set; }
        public string ShipperMobile2 { get; set; }
    }

    [KnownType(typeof(ImportConsigneeInformation))]
    public class ImportConsigneeInformation
    {
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
        public string ConsigneeStreet
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
        public string ConsigneeName2 { get; set; }
        public string ConsigneeStreet2 { get; set; }
        public string ConsigneeMobile2 { get; set; }
    }

    [KnownType(typeof(ImportNotifyDetails))]
    public class ImportNotifyDetails
    {
        public string NotifyName
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
        public string NotifyAddress
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

    [KnownType(typeof(ImportNominyDetails))]
    public class ImportNominyDetails
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

    [KnownType(typeof(ImportAgentModelDetail))]
    public class ImportAgentModelDetail
    {
        public string AgentAccountNumber { get; set; }
        public string AgentParticipant { get; set; }
        public string AgentIATACode { get; set; }
        public string AgentName { get; set; }
        public string AgentIATACASSAddress { get; set; }
        public string AgentPlace { get; set; }
    }

    [KnownType(typeof(ImportOSIInformation))]
    public class ImportOSIInformation
    {
        public string SCI
        {
            get;
            set;
        }
        public string OSI
        {
            get;
            set;
        }
        public string OCI
        {
            get;
            set;
        }
        public string NatureOfGoods
        {
            get;
            set;
        }
        public string Remarks
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ImportAWBHandlingMessage))]
    public class ImportAWBHandlingMessage
    {
        public string AWBSNo { get; set; }
        public string HandlingMessageTypeSNo { get; set; }
        public string Message { get; set; }
    }

    [KnownType(typeof(ImportAWBOSIModel))]
    public class ImportAWBOSIModel
    {
        public string AWBSNo { get; set; }
        public string OSI { get; set; }
    }

    [KnownType(typeof(ImportAWBOCIModel))]
    public class ImportAWBOCIModel
    {
        public string AWBSNo { get; set; }
        public string CountryCode { get; set; }
        public string InfoType { get; set; }
        public string CSControlInfoIdentifire { get; set; }
        public string SCSControlInfoIdentifire { get; set; }
    }

    [KnownType(typeof(ImportSummaryArray))]
    public class ImportSummaryArray
    {
        public string SSRDesc1 { get; set; }
        public string SSRDesc2 { get; set; }
        public string SSRDesc3 { get; set; }
        public string ARDFileRef { get; set; }
        public string OPIName { get; set; }
        public string OPIAirport { get; set; }
        public string OfficeDesignator { get; set; }
        public string OPICompDesignator { get; set; }
        public string OPIOtherFileRef { get; set; }
        public string OPIParticipantCode { get; set; }
        public string OPIOthAirport { get; set; }
        public string SRIRefNumber { get; set; }
        public string SRISupInfo1 { get; set; }
        public string SRISupInfo2 { get; set; }
        public string CERSignature { get; set; }
        public string ISUDate { get; set; }
        public string ISUPlace { get; set; }
        public string ISUSignature { get; set; }
        public string REFAirportCity { get; set; }
        public string REFOfficeDesignator { get; set; }
        public string REFCompDesignator { get; set; }
        public string REFOthPartOfficeFileRef { get; set; }
        public string REFParticipantCode { get; set; }
        public string REFOthAirportCity { get; set; }
        public string TCORCustomsOrigin { get; set; }

    }

    [KnownType(typeof(ImportChargeDeclarations))]
    public class ImportChargeDeclarations
    {
        public string ChargeDeclarationsCurrency { get; set; }
        public string ChargeDeclarationsValuation { get; set; }
        public string ChargeDeclarationsOtherCharge { get; set; }
        public Nullable<Decimal> ChargeDeclarationsDecCarriageVal { get; set; }
        public Nullable<Decimal> ChargeDeclarationsDecCustomsVal { get; set; }
        public Nullable<Decimal> ChargeDeclarationsInsurance { get; set; }
        public Nullable<Decimal> ChargeDeclarationsValuationCharge { get; set; }
    }

    [KnownType(typeof(ImportHAWBInformation))]
    public class ImportHAWBInformation
    {
        public int AWBSNo { get; set; }
        public string HAWBOrigin { get; set; }
        public string HAWBDestination { get; set; }
        public string HAWBNo { get; set; }
        public string HAWBCommodity { get; set; }
        public string HAWBSPHC { get; set; }
        public string HAWBPieces { get; set; }
        public string HAWBGrossWeight { get; set; }
        public string HAWBVolumeWeight { get; set; }
        public string HAWBChargeableWeight { get; set; }
        public string HAWBAWBCurrency { get; set; }
        public string HAWBNatureofGoods { get; set; }
        public string HAWBDescriptionOfGoods { get; set; }
        public string HAWBFreightType { get; set; }
        public string HAWBHarmonisedCommodityCode { get; set; }
    }

    [KnownType(typeof(ImportEDoxDetailAWD))]
    public class ImportEDoxDetailAWD
    {
        public string BankConsigned { get; set; }
        public string BankReleaseReceived { get; set; }
        public string EDoxdocumenttypeSNo { get; set; }
        public string DocName { get; set; }
        public string AltDocName { get; set; }
        public string ReferenceNo { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(ImportAWBEDoxDetail))]
    public class ImportAWBEDoxDetail
    {
        public string EDoxdocumenttypeSNo { get; set; }
        public string DocName { get; set; }
        public string AltDocName { get; set; }
        public string ReferenceNo { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(EDoxCheckListDetail))]
    public class EDoxCheckListDetail
    {
        public int ProcessType { get; set; }
        public int HAWBSNo { get; set; }
        public string EDoxdocumenttypeSNo { get; set; }
        public string EDoxDocName { get; set; }
        public string EDoxAltDocName { get; set; }
        public string EDoxReferenceNo { get; set; }
        public string EDoxRemarks { get; set; }
    }

    [KnownType(typeof(ImportSPHCDoxArray))]
    public class ImportSPHCDoxArray
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string SPHCSNo { get; set; }
        public string DocName { get; set; }
        public string AltDocName { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(BindFAASectionChargeDescription))]
    public class BindFAASectionChargeDescription
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string TariffSNo { get; set; }
        public string ChargeDescription { get; set; }
        public string ChargeCode { get; set; }
        public string Amount { get; set; }
        //public int TotalAmount { get; set; }
    }

    [KnownType(typeof(BindFAASectionAWBInformation))]
    public class BindFAASectionAWBInformation
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Pcs { get; set; }
        public string Weight { get; set; }
        public string CCPP { get; set; }
        public string CargoType { get; set; }
        public string Contents { get; set; }
    }

    [KnownType(typeof(BindFAASectionEmailHistory))]
    public class BindFAASectionEmailHistory
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Pcs { get; set; }
        public string Weight { get; set; }
        public string CCPP { get; set; }
        public string CargoType { get; set; }
        public string Contents { get; set; }
        public string EmailSentdatetime { get; set; }
        public string EmailSentBy { get; set; }
        public string EmailSentTo { get; set; }
        public string Remarks { get; set; }
        public string FAX { get; set; }

    }

    [KnownType(typeof(BindFAASectionSMSHistory))]
    public class BindFAASectionSMSHistory
    {
        public string SNo { get; set; }
        public string MobileNo { get; set; }
        public string SMSCotent { get; set; }
        public string SendAt { get; set; }
        public string Status { get; set; }
    }

    [KnownType(typeof(BindLocation))]
    public class BindLocation
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string HAWBNo { get; set; }
        public string Received { get; set; }
        public string Location { get; set; }
        public string MovableLocation { get; set; }
        public int Pieces { get; set; }
        public int StartPieces { get; set; }
        public int EndPieces { get; set; }
        public Nullable<Decimal> Weight { get; set; }
    }

    [KnownType(typeof(DeliveryOrderDetail))]
    public class DeliveryOrderDetail
    {
        public int SNo { get; set; }
        public string ConsigneeName { get; set; }
        public string DONo { get; set; }
        public string Notify { get; set; }
        public string Date { get; set; }
        public string WarehouseLocation { get; set; }
        public string InitialPaymentType { get; set; }
    }

    [KnownType(typeof(DOFlightDetail))]
    public class DOFlightDetail
    {
        public string SNo { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string SPHC { get; set; }
        public string NatureOfGoods { get; set; }
        public string FlightDetail { get; set; }
    }

    [KnownType(typeof(DODetail))]
    public class DODetail
    {
        public DeliveryOrderDetail DeliveryOrder { get; set; }
        public List<DOFlightDetail> FlightDetail { get; set; }
    }

    [KnownType(typeof(DeliveryOrderInfo))]
    public class DeliveryOrderInfo
    {
        public int CustomerType { get; set; }
        public int AWBSNo { get; set; }
        public bool PaymentType { get; set; }
        public string RctNo { get; set; }
        public string RctDate { get; set; }
        public int HAWBSNo { get; set; }
        public string Remarks { get; set; }
        public int ParticipantSNo { get; set; }
        public int ArrivedShipmentSNo { get; set; }
        public bool IsPartDo { get; set; }
        public int BillTo { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWt { get; set; }
        public string AuthorizedPersoneId { get; set; }
        public string AuthorizedPersoneName { get; set; }
        public string AuthorizedPersonCompany { get; set; }
        public string BillToText { get; set; }
        public string ConsigneeName { get; set; }


    }

    [KnownType(typeof(DOHandlingCharges))]
    public class DOHandlingCharges
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
        public string pValue { get; set; }
        [Order(7)]
        public string sValue { get; set; }
        [Order(8)]
        public decimal Amount { get; set; }

        [Order(9)]
        public decimal Discount { get; set; } = 0;
        [Order(10)]
        public decimal DiscountPercent { get; set; } = 0;

        [Order(11)]
        public decimal TotalTaxAmount { get; set; }
        [Order(12)]
        public decimal TaxDiscount { get; set; } = 0;
        [Order(13)]
        public decimal TaxDiscountPercent { get; set; } = 0;
        [Order(14)]
        public decimal TotalAmount { get; set; }

        [Order(15)]
        public string Rate { get; set; }
        [Order(16)]
        public string Min { get; set; }
        [Order(17)]
        public string Mode { get; set; }
        [Order(18)]
        public string ChargeTo { get; set; }
        [Order(19)]
        public string pBasis { get; set; }
        [Order(20)]
        public string sBasis { get; set; }
        [Order(21)]
        public string Remarks { get; set; }
        [Order(22)]
        public string WaveoffRemarks { get; set; }
        [Order(23)]
        public string DescriptionRemarks { get; set; }
        [Order(24)]
        public string TaxPercent { get; set; }
    }

    [KnownType(typeof(DOShipmentInfo))]
    public class DOShipmentInfo
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
        public string SPHCTransSNo { get; set; }
        public string ULDSNo { get; set; }
    }

    [KnownType(typeof(ImportPayment))]
    public class ImportPayment
    {
        public string SNo { get; set; }
        public string AWBSNo { get; set; }
        public string Process { get; set; }
        public bool DocumentType { get; set; }
        public string DocumentNo { get; set; }
        public int CurrencySNo { get; set; }
        public decimal Amount { get; set; }
        public string Remarks { get; set; }
    }

    [KnownType(typeof(PhysicalDeliveryInfo))]
    public class PhysicalDeliveryInfo
    {
        public int DOSNo { get; set; }
        //public bool IsBondedWarehouseTransfer { get; set; }
        public bool IsConsolidatorDOReceived { get; set; }
        public int DeliveredToSNo { get; set; }
        public string Date { get; set; }
        public string PDSRemarks { get; set; }
        public bool CustomerRelease { get; set; }
        public int CustomerType { get; set; }
        public string AuthorizedPersoneId { get; set; }
        public string AuthorizedPersoneName { get; set; }
        public string AuthorizedPersonCompany { get; set; }
        public int PDPieces { get; set; }
        public decimal PDGrossWeight { get; set; }
        public string ULDSNo { get; set; }
        public string POMailSNo { get; set; }
    }

    [KnownType(typeof(HarmonizedCommodityCode))]
    public class HarmonizedCommodityCode
    {
        public string harmonizedCommodityCode { get; set; }

    }
    [KnownType(typeof(HawbDescription))]
    public class HawbDescription
    {
        public string hawbDescription { get; set; }

    }

    public class DeliveryOrderGetWebForm
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string IsSubModule { get; set; }
    }

    public class DeliveryOrderSearch
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string searchAirline { get; set; }
        public string searchFlightNo { get; set; }
        public string searchAWBNo { get; set; }
        public string searchSPHC { get; set; }
        public string searchConsignee { get; set; }
        public string SearchIncludeTransitAWB { get; set; }
        public string SearchExcludeDeliveredAWB { get; set; }
        public string LoggedInCity { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }

    }

    [KnownType(typeof(GetDeliveryOrderGridData))]
    public class GetDeliveryOrderGridData
    {
        public string searchAirline { get; set; }
        public string searchFlightNo { get; set; }
        public string searchAWBNo { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string SearchIncludeTransitAWB { get; set; }
        public string SearchExcludeDeliveredAWB { get; set; }
        public string LoggedInCity { get; set; }
        public string searchSPHC { get; set; }
        public string searchConsignee { get; set; }
    }

    public class ConsignmentDetails
    {
        public int Type { get; set; }
        public string WayBillNo { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string Product { get; set; }
        public string WayBillDate { get; set; }
        public string Agent { get; set; }
        public int NoOfHouses { get; set; }
        public int WayBillPieces { get; set; }
        public float GrossWeight { get; set; }
        public string CBM { get; set; }
        public float ChargeableWeight { get; set; }
        public float VolumeWeight { get; set; }
        public string SHC { get; set; }
        public string Commodity { get; set; }
        public int BUP { get; set; }
        public string BUPType { get; set; }
        public string DensityGroup { get; set; }
        //shipper information
        public int IsShipper { get; set; }
        public string ShipperAccNo { get; set; }
        public string ShipperTaxID { get; set; }
        public string ShipperName { get; set; }
        public string ShipperName_2 { get; set; }
        public string ShipperAddress { get; set; }
        public string ShipperAddress_2 { get; set; }
        public string ShipperTown { get; set; }
        public string ShipperState { get; set; }
        public string ShipperPostalCode { get; set; }
        public string ShipperContactNo { get; set; }
        public string ShipperContactNo_2 { get; set; }
        public string ShipperEmail { get; set; }
        public string ShipperCountry { get; set; }
        public string ShipperCity { get; set; }
        public string ShipperFax { get; set; }
        //consignee information
        public int IsConsignee { get; set; }
        public string ConsigneeAccNo { get; set; }
        public string ConsigneeTaxID { get; set; }
        public string ConsigneeName { get; set; }
        public string ConsigneeName_2 { get; set; }
        public string ConsigneeAddress { get; set; }
        public string ConsigneeAddress_2 { get; set; }
        public string ConsigneeTown { get; set; }
        public string ConsigneeState { get; set; }
        public string ConsigneePostalCode { get; set; }
        public string ConsigneeContactNo { get; set; }
        public string ConsigneeContactNo_2 { get; set; }
        public string ConsigneeEmail { get; set; }
        public string ConsigneeCountry { get; set; }
        public string ConsigneeCity { get; set; }
        public string ConsigneeFax { get; set; }
    }




}
