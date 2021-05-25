using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(ULDLocation))]
    public class ULDLocation
    {
        [Order(1)]
        public int RowNo { get; set; }
        [Order(2)]
        public string ULDSNo { get; set; }
        [Order(3)]
        public string LocationSno { get; set; }
        [Order(4)]
        public string ConsumablesSno { get; set; }
        [Order(5)]
        public string StartTemp { get; set; }
        [Order(6)]
        public string EndTemp { get; set; }
        [Order(7)]
        public string CapturedTemp { get; set; }
        [Order(8)]
        public string sphccode { get; set; }
    }

    [KnownType(typeof(AWB))]
    public class AWB
    {
        #region Public Properties
        public string SNo
        {
            get;
            set;
        }
        public char AWBNo
        {
            get;
            set;
        }
        public string AWBDate
        {
            get;
            set;
        }
        public string DailyFlightSNo
        {
            get;
            set;
        }
        public string OriginCity
        {
            get;
            set;
        }
        public string DestinationCity
        {
            get;
            set;
        }
        public string ImportCity
        {
            get;
            set;
        }
        public string ImportFlightDate
        {
            get;
            set;
        }
        public string ImportFlightNo
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
        public string Pieces
        {
            get;
            set;
        }
        public string ProductSNo
        {
            get;
            set;
        }
        public string IsPrepaid
        {
            get;
            set;
        }
        public string SpecialHandlingCode1
        {
            get;
            set;
        }
        public string SpecialHandlingCode2
        {
            get;
            set;
        }
        public string UNNo1
        {
            get;
            set;
        }
        public string UNNo2
        {
            get;
            set;
        }
        public string AirlineCurrencyCode
        {
            get;
            set;
        }
        public string AWBCurrencyCode
        {
            get;
            set;
        }
        public string AWBCurrencyExRate
        {
            get;
            set;
        }
        public string IsMinimum
        {
            get;
            set;
        }
        public string OfficeAirlineCitySNo
        {
            get;
            set;
        }
        public string AgentAllocationCode
        {
            get;
            set;
        }
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
        public string TariffRate
        {
            get;
            set;
        }
        public string TariffAmount
        {
            get;
            set;
        }
        public string Freight
        {
            get;
            set;
        }
        public string SSPRate
        {
            get;
            set;
        }
        public string SSPAmount
        {
            get;
            set;
        }
        public string GSARate
        {
            get;
            set;
        }
        public string GSAAmount
        {
            get;
            set;
        }
        public string FOCAmount
        {
            get;
            set;
        }
        public string PWeightCharges
        {
            get;
            set;
        }
        public string PValuationCharges
        {
            get;
            set;
        }
        public string PTaxCharges
        {
            get;
            set;
        }
        public string PDueAgentCharges
        {
            get;
            set;
        }
        public string PDueCarrierCharges
        {
            get;
            set;
        }
        public string PTotalCharges
        {
            get;
            set;
        }
        public string CWeightCharges
        {
            get;
            set;
        }
        public string CValuationCharges
        {
            get;
            set;
        }
        public string CTaxCharges
        {
            get;
            set;
        }
        public string CDueAgentCharges
        {
            get;
            set;
        }
        public string CDueCarrierCharges
        {
            get;
            set;
        }
        public string CTotalCharges
        {
            get;
            set;
        }
        public string CWeightChargesUpdated
        {
            get;
            set;
        }
        public string CValuationChargesUpdated
        {
            get;
            set;
        }
        public string CTaxChargesUpdated
        {
            get;
            set;
        }
        public string CDueAgentChargesUpdated
        {
            get;
            set;
        }
        public string CDueCarrierChargesUpdated
        {
            get;
            set;
        }
        public string CTotalChargesUpdated
        {
            get;
            set;
        }
        public string DeclaredCarriageValue
        {
            get;
            set;
        }
        public string DeclaredCustomsValue
        {
            get;
            set;
        }
        public string HandlingInformation
        {
            get;
            set;
        }
        public string NatureOfGoods
        {
            get;
            set;
        }
        public string SCI
        {
            get;
            set;
        }
        public string CommoditySNo
        {
            get;
            set;
        }
        public string OtherCommodity
        {
            get;
            set;
        }
        public string InsuranceAmount
        {
            get;
            set;
        }
        public string StatusNo
        {
            get;
            set;
        }
        public string GSACSRStatus
        {
            get;
            set;
        }
        public string AgentCSRStatus
        {
            get;
            set;
        }
        public string BillingStatus
        {
            get;
            set;
        }
        public string Tax
        {
            get;
            set;
        }
        public string Remarks
        {
            get;
            set;
        }
        public string UpdatedBy
        {
            get;
            set;
        }
        public string UpdatedOn
        {
            get;
            set;
        }

        public string AgentBranchSNo
        {
            get;
            set;
        }
        public string OfficeExchangeRate
        {
            get;
            set;
        }
        public string OfficeExchangeAmount
        {
            get;
            set;
        }
        public string AgentExchangeRate
        {
            get;
            set;
        }
        public string AgentExchangeAmount
        {
            get;
            set;
        }
        public string EDIRemarks
        {
            get;
            set;
        }
        public string ImportDestination
        {
            get;
            set;
        }
        public string Volume
        {
            get;
            set;
        }
        public string PaymentMode
        {
            get;
            set;
        }
        public string XRayRequired
        {
            get;
            set;
        }
        public string XRayCostBillTo
        {
            get;
            set;
        }
        public string MoveMentType
        {
            get;
            set;
        }
        public string TransitCity
        {
            get;
            set;
        }
        public string LocationSNo
        {
            get;
            set;
        }
        public string IsDocumentDelivered
        {
            get;
            set;
        }
        public string DOName
        {
            get;
            set;
        }
        public string DOID
        {
            get;
            set;
        }
        public string DORemarks
        {
            get;
            set;
        }
        public string IsFOC
        {
            get;
            set;
        }
        public string FOCShipmentType
        {
            get;
            set;
        }
        public string OCI
        {
            get;
            set;
        }
        public string OSI
        {
            get;
            set;
        }
        public bool DocumentChecked
        {
            get;
            set;
        }
        public string IsPaymentReceived
        {
            get;
            set;
        }
        public string IsShipmentstringact
        {
            get;
            set;
        }
        public string IsVerifiedByDocClerk
        {
            get;
            set;
        }
        public string VerifiedByDocClerk
        {
            get;
            set;
        }
        public string VerifiedByDocClerkDate
        {
            get;
            set;
        }
        public string IsImpPaymentReceived
        {
            get;
            set;
        }
        public string IsLateStorageChrgReceived
        {
            get;
            set;
        }
        public string TotalULD
        {
            get;
            set;
        }
        public string LoosePieces
        {
            get;
            set;
        }
        public string LooseGrossWeight
        {
            get;
            set;
        }
        public string LooseVolumeWeight
        {
            get;
            set;
        }
        public string DocumentVerfiedDate
        {
            get;
            set;
        }
        public string LocationGeneratedDate
        {
            get;
            set;
        }
        public string IsCourier
        {
            get;
            set;
        }
        public string CourierType
        {
            get;
            set;
        }
        public string CourierCommoditySNo
        {
            get;
            set;
        }
        public string CourierProductSNo
        {
            get;
            set;
        }
        public string DocumentCheckDate
        {
            get;
            set;
        }
        public string TransferredFrom
        {
            get;
            set;
        }
        public string NoOfHouse
        {
            get;
            set;
        }
        public string HouseFeededBy
        {
            get;
            set;
        }
        public string TRMReceived
        {
            get;
            set;
        }
        public string AppostringedAgentSno
        {
            get;
            set;
        }
        public string AppostringedSubAgentSno
        {
            get;
            set;
        }
        public string AssignLocation
        {
            get;
            set;
        }
        public string AWBTotalPieces
        {
            get;
            set;
        }
        public string IsDocumentDeliveredDate
        {
            get;
            set;
        }
        public string IsIPFreight
        {
            get;
            set;
        }
        public string IataAgentCode
        {
            get;
            set;
        }
        public string AgentAccountNumber
        {
            get;
            set;
        }
        public string AgentName
        {
            get;
            set;
        }
        public string AgentPlace
        {
            get;
            set;
        }
        public string IsImpPaymentReceivedDate
        {
            get;
            set;
        }
        public string IsDelivered
        {
            get;
            set;
        }
        public string TotalVolumeWeight
        {
            get;
            set;
        }
        public string ShowSlacDetails
        {
            get;
            set;
        }
        public string DocsatAC
        {
            get;
            set;
        }
        public string HouseTktNo
        {
            get;
            set;
        }
        public string AWBTotalChargeableWeight
        {
            get;
            set;
        }
        public string AWBTotalGrossWeight
        {
            get;
            set;
        }
        public string AWBTotalVolumeWeight
        {
            get;
            set;
        }
        public string IsLocationAssign
        {
            get;
            set;
        }
        public string IsXrayAssign
        {
            get;
            set;
        }
        public string AgentBranchSNoNew
        {
            get;
            set;
        }
        #endregion
    }

    [KnownType(typeof(FblBooking))]
    public class FblBooking
    {
        [Order(1)]
        public string SNo
        {
            get;
            set;
        }
        [Order(2)]
        public char AWBNo
        {
            get;
            set;
        }
        [Order(3)]
        public string AWBDate
        {
            get;
            set;
        }
        [Order(4)]
        public string DailyFlightSNo
        {
            get;
            set;
        }
        [Order(5)]
        public string OriginCity
        {
            get;
            set;
        }
        [Order(6)]
        public string DestinationCity
        {
            get;
            set;
        }
        [Order(7)]
        public string GrossWeight
        {
            get;
            set;
        }
        [Order(8)]
        public string VolumeWeight
        {
            get;
            set;
        }
        [Order(9)]
        public string ChargeableWeight
        {
            get;
            set;
        }
        [Order(10)]
        public string Pieces
        {
            get;
            set;
        }
        [Order(11)]
        public string AWbPieces
        {
            get;
            set;
        }
        [Order(12)]
        public string AWBGrossWeight
        {
            get;
            set;
        }
        [Order(13)]
        public string AWBVolumeWeight
        {
            get;
            set;
        }
        [Order(14)]
        public string AWBChargeableWeight
        {
            get;
            set;
        }
        [Order(15)]
        public string SpecialHandlingCode1
        {
            get;
            set;
        }
        [Order(16)]
        public string SpecialHandlingCode2
        {
            get;
            set;
        }
        [Order(17)]
        public string NatureOfGoods
        {
            get;
            set;
        }
        [Order(18)]
        public string StatusNo
        {
            get;
            set;
        }
        [Order(19)]
        public string MovementType
        {
            get;
            set;
        }
        [Order(20)]
        public string UpdatedBy
        {
            get;
            set;
        }
        [Order(21)]
        public string UpdatedOn
        {
            get;
            set;
        }

        [Order(23)]
        public string IsReservation
        {
            get;
            set;
        }
        [Order(24)]
        public string IsOperation
        {
            get;
            set;
        }
        [Order(25)]
        public string IsPayment
        {
            get;
            set;
        }
        [Order(26)]
        public string IsDirectAcceptance
        {
            get;
            set;
        }
        public string AcceptanceTime
        {
            get;
            set;
        }
        [Order(27)]
        public string isQrt
        {
            get;
            set;
        }
        [Order(28)]
        public string IsLIPrepared
        {
            get;
            set;
        }
        [Order(29)]
        public string FBlUpdatedBy
        {
            get;
            set;
        }
        [Order(30)]
        public string DocumentCheckDate
        {
            get;
            set;
        }
        [Order(31)]
        public string AWBSNo
        {
            get;
            set;
        }
        [Order(32)]
        public string IsCourier
        {
            get;
            set;
        }
        [Order(33)]
        public string CourierType
        {
            get;
            set;
        }
        [Order(34)]
        public string OpsUpdatedOn
        {
            get;
            set;
        }
        [Order(35)]
        public string OpsUpdatedBy
        {
            get;
            set;
        }
        [Order(36)]
        public string CashierUpdatedOn
        {
            get;
            set;
        }
        [Order(37)]
        public string CashierUpdatedby
        {
            get;
            set;
        }
    }

    [KnownType(typeof(FlightPlan))]
    public class FlightPlan
    {
        [Order(1)]
        public string SNo
        {
            get;
            set;
        }
        [Order(2)]
        public string AWBSNo
        {
            get;
            set;
        }
        [Order(3)]
        public string DailyFlightSNo
        {
            get;
            set;
        }
        [Order(4)]
        public string Pieces
        {
            get;
            set;
        }
        [Order(5)]
        public string GrossWeight
        {
            get;
            set;
        }
        [Order(6)]
        public string VolumeWeight
        {
            get;
            set;
        }
        [Order(7)]
        public string Revenue
        {
            get;
            set;
        }
        [Order(8)]
        public string Priority
        {
            get;
            set;
        }
        [Order(9)]
        public string Remarks
        {
            get;
            set;
        }
        [Order(10)]
        public string MovementType
        {
            get;
            set;
        }
        [Order(11)]
        public string IsConfirmed
        {
            get;
            set;
        }
        [Order(12)]
        public string IsManifested
        {
            get;
            set;
        }
        [Order(13)]
        public string ShipmentStatus
        {
            get;
            set;
        }
        [Order(14)]
        public string IsBilled
        {
            get;
            set;
        }
        [Order(15)]
        public string UpdatedOn
        {
            get;
            set;
        }
        [Order(16)]
        public string UpdatedBy
        {
            get;
            set;
        }

        [Order(18)]
        public string MCBookingSNo
        {
            get;
            set;
        }
        [Order(19)]
        public string ImportAWBSNo
        {
            get;
            set;
        }
        [Order(20)]
        public string LoosePieces
        {
            get;
            set;
        }
        [Order(21)]
        public string LooseGrossWeight
        {
            get;
            set;
        }
        [Order(22)]
        public string LooseVolumeWeight
        {
            get;
            set;
        }
        [Order(23)]
        public string BilledToDailyFlightSNo
        {
            get;
            set;
        }
        [Order(24)]
        public string TotalVolumeWeight
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ShipmentInformation))]
    public class ShipmentInformation
    {
        [Order(1)]
        public string IsCourier { get; set; }
        [Order(2)]
        public string ShowSlacDetails { get; set; }
        [Order(3)]
        public string AWBNo { get; set; }
        [Order(4)]
        public string AgentBranchSNo { get; set; }
        [Order(5)]
        public string AWBTotalPieces { get; set; }
        [Order(6)]
        public string CommoditySubGroupSNo { get; set; }
        [Order(7)]
        public string CommoditySNo { get; set; }
        [Order(8)]
        public string GrossWeight { get; set; }
        [Order(9)]
        public string VolumeWeight { get; set; }
        [Order(10)]
        public string ChargeableWeight { get; set; }
        [Order(11)]
        public string Pieces { get; set; }
        [Order(12)]
        public string ProductSNo { get; set; }
        [Order(13)]
        public string IsPrepaid { get; set; }
        [Order(14)]
        public string OriginCity { get; set; }
        [Order(15)]
        public string DestinationCity { get; set; }
        [Order(16)]
        public string XRayRequired { get; set; }
        [Order(17)]
        public string NoOfHouse { get; set; }
        [Order(18)]
        public string HouseFeededBy { get; set; }
        [Order(19)]
        public string AWBDate { get; set; }
        [Order(20)]
        public string NatureOfGoodsSNo { get; set; }
        [Order(21)]
        public string NatureOfGoods { get; set; }
        [Order(22)]
        public string IsBup { get; set; }
        [Order(23)]
        public string buptypeSNo { get; set; }
        [Order(24)]
        public string DensityGroupSNo { get; set; }
        [Order(25)]
        public string AirlineSNo { get; set; }
        [Order(26)]
        public string CBM { get; set; }
        [Order(27)]
        public string DGRPcs { get; set; }
        [Order(28)]
        public string DRYICEasRefrigerant { get; set; }
        [Order(29)]
        public string NoofBup { get; set; }
    }

    [KnownType(typeof(ItineraryInformation))]
    public class ItineraryInformation
    {

        [Order(1)]
        public string FPSNo
        {
            get;
            set;
        }
        [Order(2)]
        public string DailyFlightSNo
        {
            get;
            set;
        }
        [Order(3)]
        public string BoardPoint
        {
            get;
            set;
        }
        [Order(4)]
        public string OffPoint
        {
            get;
            set;
        }
        [Order(5)]
        public string FlightDate
        {
            get;
            set;
        }
        [Order(6)]
        public string FlightNo
        {
            get;
            set;
        }


    }
    [KnownType(typeof(AWBSPHC))]
    public class AWBSPHC
    {
        [Order(1)]
        public string AWBSNo
        {
            get;
            set;
        }
        [Order(2)]
        public string AWBNo
        {
            get;
            set;
        }
        [Order(3)]
        public string SPHCCode
        {
            get;
            set;
        }
    }

    [KnownType(typeof(AWBSPHCTrans))]
    public class AWBSPHCTrans
    {
        [Order(1)]
        public string SNo
        {
            get;
            set;
        }
        [Order(2)]
        public string AWBSNo
        {
            get;
            set;
        }
        [Order(3)]
        public string AWBNo
        {
            get;
            set;
        }
        [Order(4)]
        public string SPHCCode
        {
            get;
            set;
        }
        [Order(5)]
        public string UNNo
        {
            get;
            set;
        }
        [Order(6)]
        public string SPHCClassSNo
        {
            get;
            set;
        }
        [Order(7)]
        public string HAWBSNo
        {
            get;
            set;
        }
        [Order(8)]
        public string IsRadioActive
        {
            get;
            set;
        }
        [Order(9)]
        public string MCBookingSNo
        {
            get;
            set;
        }
        [Order(10)]
        public string SubRisk
        {
            get;
            set;
        }
        [Order(11)]
        public string RamCat
        {
            get;
            set;
        }
        [Order(12)]
        public string UnPackingGroupImpCode
        {
            get;
            set;
        }
        [Order(13)]
        public string CaoX
        {
            get;
            set;
        }
        [Order(13)]
        public string ImpCode
        {
            get;
            set;
        }
    }

    [KnownType(typeof(DGRArray))]
    public class DGRArray
    {
        [Order(1)]
        public string SPHCSNo { get; set; }

        [Order(2)]
        public string SPHCCode { get; set; }

        [Order(3)]
        public string DGRSNo { get; set; }

        [Order(4)]
        public string UNNo { get; set; }

        [Order(5)]
        public string DGRShipperSNo { get; set; }

        [Order(6)]
        public string ProperShippingName { get; set; }

        [Order(7)]
        public string Class { get; set; }

        [Order(8)]
        public string TP { get; set; }

        [Order(9)]
        public string SubRisk { get; set; }

        [Order(10)]
        public string PackingGroup { get; set; }

        [Order(11)]
        public string Pieces { get; set; }

        [Order(12)]
        public string NetQuantity { get; set; }

        [Order(13)]
        public string Unit { get; set; }

        [Order(14)]
        public string Quantity { get; set; }

        [Order(15)]
        public string PackingInst { get; set; }

        [Order(16)]
        public string RAMCategory { get; set; }

        [Order(17)]
        public string ERGN { get; set; }

        [Order(18)]
        public string Commodity { get; set; }
    }

    [KnownType(typeof(NOGArray))]
    public class NOGArray
    {
        [Order(1)]
        public int AWBSNo { get; set; }
        [Order(2)]
        public int NogPieces { get; set; }
        [Order(3)]
        public string NogGrossWt { get; set; }
        [Order(4)]
        public string NogSNo { get; set; }
        [Order(5)]
        public string NOG { get; set; }
    }

    [KnownType(typeof(SHCSubGroupArray))]
    public class SHCSubGroupArray
    {
        [Order(1)]
        public int AWBSNo { get; set; }
        [Order(2)]
        public int SHCSNo { get; set; }
        [Order(3)]
        public string SubGroupSno { get; set; }
        [Order(4)]
        public string MandatoryInfo { get; set; }
        [Order(5)]
        public string PackingInst { get; set; }
    }

    [KnownType(typeof(SHCTemp))]
    public class SHCTemp
    {
        [Order(1)]
        public int AWBSNo { get; set; }
        [Order(2)]
        public string SHCSNo { get; set; }
        [Order(3)]
        public string StartTemp { get; set; }
        [Order(4)]
        public string EndTemp { get; set; }
        [Order(5)]
        public string Pieces { get; set; }
    }

    [KnownType(typeof(DGRArraySeprate))]
    public class DGRArraySeprate
    {
        [Order(1)]
        public string SPHCSNo { get; set; }

        [Order(2)]
        public string SPHCCode { get; set; }

        [Order(3)]
        public string DGRSNo { get; set; }

        [Order(4)]
        public string UNNo { get; set; }

        [Order(5)]
        public string DGRShipperSNo { get; set; }

        [Order(6)]
        public string ProperShippingName { get; set; }

        [Order(7)]
        public string Class { get; set; }

        [Order(8)]
        public string TP { get; set; }


        [Order(9)]
        public string SubRisk { get; set; }

        [Order(10)]
        public string PackingGroup { get; set; }

        [Order(11)]
        public string Pieces { get; set; }

        [Order(12)]
        public string NetQuantity { get; set; }

        [Order(13)]
        public string Unit { get; set; }

        [Order(14)]
        public string Quantity { get; set; }

        [Order(15)]
        public string PackingInst { get; set; }

        [Order(16)]
        public string RAMCategory { get; set; }

        [Order(17)]
        public string ERGN { get; set; }

        [Order(18)]
        public string Commodity { get; set; }
    }

    [KnownType(typeof(ShipperInformation))]
    public class ShipperInformation
    {
        [Order(1)]
        public string ShipperAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string ShipperName
        {
            get;
            set;
        }
        [Order(3)]
        public string ShipperName2
        {
            get;
            set;
        }

        [Order(4)]
        public string ShipperStreet
        {
            get;
            set;
        }
        [Order(5)]
        public string ShipperStreet2
        {
            get;
            set;
        }
        [Order(6)]
        public string ShipperLocation
        {
            get;
            set;
        }
        [Order(7)]
        public string ShipperState
        {
            get;
            set;
        }
        [Order(8)]
        public string ShipperPostalCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ShipperCity
        {
            get;
            set;
        }
        [Order(10)]
        public string ShipperCountryCode
        {
            get;
            set;
        }
        [Order(11)]
        public string ShipperMobile
        {
            get;
            set;
        }
        [Order(12)]
        public string ShipperMobile2
        {
            get;
            set;
        }
        [Order(13)]
        public string ShipperEMail
        {
            get;
            set;
        }
        [Order(14)]
        public string ShipperFax
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ConsigneeInformation))]
    public class ConsigneeInformation
    {
        [Order(1)]
        public string ConsigneeAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string ConsigneeName
        {
            get;
            set;
        }
        [Order(3)]
        public string ConsigneeName2
        {
            get;
            set;
        }

        [Order(4)]
        public string ConsigneeStreet
        {
            get;
            set;
        }
        [Order(5)]
        public string ConsigneeStreet2
        {
            get;
            set;
        }

        [Order(6)]
        public string ConsigneeLocation
        {
            get;
            set;
        }
        [Order(7)]
        public string ConsigneeState
        {
            get;
            set;
        }
        [Order(8)]
        public string ConsigneePostalCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ConsigneeCity
        {
            get;
            set;
        }
        [Order(10)]
        public string ConsigneeCountryCode
        {
            get;
            set;
        }
        [Order(11)]
        public string ConsigneeMobile
        {
            get;
            set;
        }
        [Order(12)]
        public string ConsigneeMobile2
        {
            get;
            set;
        }

        [Order(13)]
        public string ConsigneeEMail
        {
            get;
            set;
        }
        [Order(14)]
        public string ConsigneeFax
        {
            get;
            set;
        }
    }

    [KnownType(typeof(AgentInfo))]
    public class AgentInfo
    {
        [Order(1)]
        public string AgentAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string AgentParticipant
        {
            get;
            set;
        }
        [Order(3)]
        public string IATACode
        {
            get;
            set;
        }

        [Order(4)]
        public string Name
        {
            get;
            set;
        }
        [Order(5)]
        public string IATACASSAddress
        {
            get;
            set;
        }

        [Order(6)]
        public string AgentPlace
        {
            get;
            set;
        }

    }

    [KnownType(typeof(NotifyDetails))]
    public class NotifyDetails
    {
        [Order(1)]
        public string NotifyName
        {
            get;
            set;
        }
        [Order(2)]
        public string NotifyName2
        {
            get;
            set;
        }
        [Order(3)]
        public string NotifyCountryCode
        {
            get;
            set;
        }
        [Order(4)]
        public string NotifyCityCode
        {
            get;
            set;
        }
        [Order(5)]
        public string NotifyMobile
        {
            get;
            set;
        }
        [Order(6)]
        public string NotifyMobile2
        {
            get;
            set;
        }
        [Order(7)]
        public string NotifyAddress
        {
            get;
            set;
        }
        [Order(8)]
        public string NotifyAddress2
        {
            get;
            set;
        }
        [Order(9)]
        public string NotifyState
        {
            get;
            set;
        }
        [Order(10)]
        public string NotifyPlace
        {
            get;
            set;
        }
        [Order(11)]
        public string NotifyPostalCode
        {
            get;
            set;
        }
        [Order(12)]
        public string NotifyFax
        {
            get;
            set;
        }
    }

    [KnownType(typeof(NominyDetails))]
    public class NominyDetails
    {
        [Order(1)]
        public string NominyName
        {
            get;
            set;
        }
        [Order(2)]
        public string NominyAddress
        {
            get;
            set;
        }

    }

    [KnownType(typeof(Dimensions))]
    public class Dimensions
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string Height { get; set; }
        [Order(3)]
        public string Length { get; set; }
        [Order(4)]
        public string Width { get; set; }
        [Order(5)]
        public string Pieces { get; set; }
        [Order(6)]
        public string CBM { get; set; }
        [Order(7)]
        public string Unit { get; set; }
        [Order(8)]
        public string VolumeWeight { get; set; }
        [Order(9)]
        public string SLISNo { get; set; }
        [Order(10)]
        public string HAWBNo { get; set; }
        [Order(11)]
        //public string AddPieces { get; set; }
        //[Order(12)]
        public string Action { get; set; }
        [Order(13)]
        public string PartPcs { get; set; }
        [Order(14)]
        public string SLINo { get; set; }
        [Order(15)]
        public string oldPieces { get; set; }
        [Order(16)]
        public string GrossWeight { get; set; }
		[Order(17)]
		public string CapturedWeight { get; set; }
		[Order(18)]
		public string TareWeight { get; set; }

	}

    [KnownType(typeof(FlightDetails))]
    public class FlightDetails
    {
        public string AWBSNo { get; set; }
        public string FlightSNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string OriginAirport { get; set; }
        public string DestinationAirport { get; set; }
        public string FlightPieces { get; set; }
        public string FlightGrossWeight { get; set; }
        public string FlightVolumeWt { get; set; }
        public string FlightVolume { get; set; }
    }

    [KnownType(typeof(AWBULDTrans))]
    public class AWBULDTrans
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string SLISNo { get; set; }
        [Order(3)]
        public string HAWBNo { get; set; }
        [Order(4)]
        public string ULDSNo { get; set; }
        [Order(5)]
        public string ULDTypeSNo { get; set; }
        [Order(6)]
        public string ULDNo { get; set; }
        [Order(7)]
        public string OwnerCode { get; set; }
        [Order(8)]
        public string SLACPieces { get; set; }
        [Order(9)]
        public string UldPieces { get; set; }
        [Order(10)]
        public string IsCMS { get; set; }
        [Order(11)]
        public string ULDLength { get; set; }
        [Order(12)]
        public string ULDWidth { get; set; }
        [Order(13)]
        public string ULDHeight { get; set; }
        [Order(14)]
        public string ULDVolWt { get; set; }
        [Order(15)]
        public string ULDCBM { get; set; }
        [Order(16)]
        public string CityCode { get; set; }
        [Order(17)]
        public string MCBookingSNo { get; set; }
        [Order(18)]
        public string DNNo { get; set; }
        [Order(19)]
        public string MailDestination { get; set; }
        [Order(20)]
        public string OriginRefNo { get; set; }
        [Order(21)]
        public string UCapturedWeight { get; set; }
        [Order(22)]
        public string UTareWeight { get; set; }
        [Order(23)]
        public string UGrossWeight { get; set; }
        [Order(24)]
        public string PhysicalUld { get; set; }

    }

    [KnownType(typeof(AWBULDDetails))]
    public class AWBULDDetails
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string SLISNo { get; set; }
        [Order(3)]
        public string ULDSNo { get; set; }
        [Order(4)]
        public string LoadingCodeSNo { get; set; }
        [Order(5)]
        public string LoadingIndicatorSNo { get; set; }
        [Order(6)]
        public string ContourCodeSNo { get; set; }
        [Order(7)]
        public string BupTypeSNo { get; set; }
        [Order(8)]
        public string BasePalletSNo { get; set; }
        [Order(9)]
        public string OtherPallets { get; set; }
    }
    [KnownType(typeof(AWBULDTypeDetails))]
    public class AWBULDTypeDetails
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string ULDType { get; set; }
        [Order(4)]
        public string ULDStockSNo { get; set; }
        [Order(5)]
        public string ULDPCS { get; set; }
        [Order(6)]
        public string ULDTypeSNo { get; set; }
        [Order(7)]
        public string UTFlightNo { get; set; }
        [Order(8)]
        public string UGrossWeight { get; set; }

    }

    [KnownType(typeof(DimensionsArray))]
    public class DimensionsArray
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string Charge { get; set; }
        [Order(3)]
        public string ChargeAmount { get; set; }
        [Order(4)]
        public string ChargeableWeight { get; set; }
        [Order(5)]
        public string CommodityItemNumber { get; set; }
        [Order(6)]
        public string Dimension { get; set; }
        [Order(7)]
        public string GrossWeight { get; set; }
        [Order(8)]
        public string NatureOfGoods { get; set; }
        [Order(9)]
        public string NoOfPieces { get; set; }
        [Order(10)]
        public string RateClassCode { get; set; }
        [Order(11)]
        public string SNo { get; set; }
        [Order(12)]
        public string WeightCode { get; set; }
        [Order(13)]
        public string hdnChildData { get; set; }
        [Order(14)]
        public string HarmonisedCommodityCode { get; set; }
        [Order(15)]
        public string CountrySNo { get; set; }
        [Order(16)]
        public string CountryCode { get; set; }
        [Order(17)]
        public string ConsolDesc { get; set; }
    }

    [KnownType(typeof(ULDDimensionsArray))]
    public class ULDDimensionsArray
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string ChargeLineCount { get; set; }
        [Order(3)]
        public string WeightCode { get; set; }
        [Order(4)]
        public string RateClassCode { get; set; }
        [Order(5)]
        public string SLAC { get; set; }
        [Order(6)]
        public string ULDTypeSNo { get; set; }
        [Order(7)]
        public string ULDTypeCode { get; set; }
        [Order(8)]
        public string ULDNo { get; set; }
        [Order(9)]
        public string Charge { get; set; }
        [Order(10)]
        public string ChargeAmount { get; set; }
        [Order(11)]
        public string HarmonisedCommodityCode { get; set; }
        [Order(12)]
        public string CountrySNo { get; set; }
        [Order(13)]
        public string CountryCode { get; set; }
        [Order(14)]
        public string NatureOfGoods { get; set; }

    }

    [KnownType(typeof(ChildData))]
    public class ChildData
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string Length { get; set; }
        [Order(4)]
        public string Width { get; set; }
        [Order(5)]
        public string Height { get; set; }
        [Order(6)]
        public string MeasurementUnitCode { get; set; }
        [Order(7)]
        public string Pieces { get; set; }
        [Order(8)]
        public string VolumeWeight { get; set; }
        [Order(9)]
        public string VolumeUnit { get; set; }
        [Order(10)]
        public string AWBRateDescriptionSNo { get; set; }

    }

    [KnownType(typeof(XrayChildData))]
    public class XrayChildData
    {
        [Order(1)]
        public string XrayRowNo { get; set; }
        [Order(2)]
        public string FaultGroupSno { get; set; }
        [Order(3)]
        public string Pieces { get; set; }
        [Order(4)]
        public string Remarks { get; set; }
        [Order(5)]
        public string Action { get; set; }
        [Order(6)]
        public string Date { get; set; }
        [Order(7)]
        public string CreatedBy { get; set; }

    }


    [KnownType(typeof(ULDXrayFailureData))]
    public class ULDXrayFailureData
    {
        [Order(1)]
        public string ULDSNo { get; set; }
        [Order(2)]
        public string ULDNo { get; set; }
        [Order(3)]
        public string Remarks { get; set; }
        [Order(4)]
        public string Action { get; set; }
        [Order(5)]
        public string Date { get; set; }
        [Order(6)]
        public string CreatedBy { get; set; }

    }

    [KnownType(typeof(OSIInformation))]
    public class OSIInformation
    {
        [Order(1)]
        public string SCI
        {
            get;
            set;
        }
        [Order(2)]
        public string OSI
        {
            get;
            set;
        }
        [Order(3)]
        public string OCI
        {
            get;
            set;
        }
        [Order(4)]
        public string NatureOfGoods
        {
            get;
            set;
        }
        [Order(5)]
        public string Remarks
        {
            get;
            set;
        }
    }

    [KnownType(typeof(AWBHandlingMessage))]
    public class AWBHandlingMessage
    {

        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string HandlingMessageTypeSNo { get; set; }
        [Order(3)]
        public string Message { get; set; }

    }
    [KnownType(typeof(AWBOSIModel))]
    public class AWBOSIModel
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string OSI { get; set; }

    }
    [KnownType(typeof(AWBOCIModel))]
    public class AWBOCIModel
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string CountryCode { get; set; }
        [Order(3)]
        public string InfoType { get; set; }
        [Order(4)]
        public string CSControlInfoIdentifire { get; set; }
        [Order(5)]
        public string SCSControlInfoIdentifire { get; set; }
    }

    [KnownType(typeof(AWBLocationXRay))]
    public class AWBLocationXRay
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string ScannedPieces { get; set; }
        [Order(4)]
        public string WareHouseLocationSNo { get; set; }
        [Order(5)]
        public string LocationUpdatedBy { get; set; }
        [Order(6)]
        public string LocationScanMode { get; set; }
        [Order(7)]
        public string XRayUpdatedBy { get; set; }
        [Order(8)]
        public string XRayScanMode { get; set; }

    }

    [KnownType(typeof(AWBXRay))]
    public class AWBXRay
    {
        [Order(1)]
        public string SNo { get; set; }

        [Order(2)]
        public string AWBNo { get; set; }

        [Order(3)]
        public string ScannedPieces { get; set; }

        [Order(4)]
        public string SLISNo { get; set; }

        [Order(5)]
        public string SLINo { get; set; }

        [Order(6)]
        public string HAWBNo { get; set; }

        [Order(7)]
        public string FaultData { get; set; }

        [Order(8)]
        public string XrayMachineSNo { get; set; }

    }

    [KnownType(typeof(AWBULDXRay))]
    public class AWBULDXRay
    {
        [Order(1)]
        public string ULDSNo { get; set; }

        [Order(2)]
        public string ULDXrayDone { get; set; }

        [Order(3)]
        public string ULDFailure { get; set; }

        [Order(4)]
        public string XrayMachineSNo { get; set; }

    }

    [KnownType(typeof(ECSDArray))]
    public class ECSDArray
    {
        [Order(1)]
        public string SecurityCode { get; set; }

        [Order(2)]
        public string SecurityIssuance { get; set; }

        [Order(3)]
        public string ScreeningMethod { get; set; }

        [Order(4)]
        public string ScreeningExemption { get; set; }

        [Order(5)]
        public string OthScreeningMthode { get; set; }

        [Order(6)]
        public string AdditionalSecurity { get; set; }

        [Order(7)]
        public string Name { get; set; }

        [Order(8)]
        public string Date { get; set; }

        [Order(9)]
        public string Time { get; set; }

        [Order(10)]
        public string PolicePersonne { get; set; }
    }

    [KnownType(typeof(AWBLocation))]
    public class AWBLocation
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBNo { get; set; }

        [Order(3)]
        public string ScannedPieces { get; set; }

        [Order(4)]
        public string LocationSNo { get; set; }

        [Order(5)]
        public string SLISNo { get; set; }

        [Order(6)]
        public string SLINo { get; set; }

        [Order(7)]
        public string HAWBNo { get; set; }

        [Order(8)]
        public string StartTemp { get; set; }

        [Order(9)]
        public string EndTemp { get; set; }
        [Order(10)]
        public string ConsumablesSno { get; set; }
        [Order(11)]
        public string CapturedTemp { get; set; }
        [Order(12)]
        public string sphccode { get; set; }

    }

    [KnownType(typeof(AWBGroup))]
    public class AWBGroup
    {
        [Order(1)]
        public string SNo
        {
            get;
            set;
        }

        [Order(2)]
        public string AWBNo { get; set; }

        [Order(3)]
        public string NoOfPieces
        {
            get;
            set;
        }

        [Order(4)]
        public string ScannedPieces { get; set; }

        [Order(5)]
        public decimal GrossWt
        {
            get;
            set;
        }

        [Order(7)]
        public string Remarks { get; set; }

        [Order(8)]
        public string SLISNo { get; set; }

        [Order(9)]
        public string SLINo { get; set; }

        [Order(10)]
        public string HAWBNo { get; set; }
    }

    [KnownType(typeof(ULDWeightModel))]
    public class ULDWeightModel
    {
        [Order(1)]
        public string ULDSNo { get; set; }
        [Order(2)]
        public string CapturedWeight { get; set; }
        [Order(3)]
        public string UldGrossWt { get; set; }
        [Order(4)]
        public string UldTareWt { get; set; }
    }

    [KnownType(typeof(HandlingCharge))]
    public class HandlingCharge
    {
        [Order(1)]
        public string AWBNo { get; set; }
        [Order(2)]
        public string HAWBNo { get; set; }
        [Order(3)]
        public string SNo { get; set; }
        [Order(4)]
        public string AWBSNo { get; set; }
        [Order(5)]
        public string WaveOff { get; set; }
        [Order(6)]
        public string TariffCodeSNo { get; set; }
        [Order(7)]
        public string TariffHeadName { get; set; }
        [Order(8)]
        public decimal pValue { get; set; }
        [Order(9)]
        public decimal sValue { get; set; }
        [Order(10)]
        public decimal Amount { get; set; }
        [Order(11)]
        public decimal Discount { get; set; }
        [Order(12)]
        public decimal DiscountPercent { get; set; }
        [Order(13)]
        public string Tax { get; set; }
        [Order(14)]
        public decimal TaxDiscount { get; set; }
        [Order(15)]
        public decimal TaxDiscountPercent { get; set; }
        [Order(16)]
        public string TotalAmount { get; set; }
        [Order(17)]
        public string Rate { get; set; }
        [Order(18)]
        public string Min { get; set; }
        [Order(19)]
        public string Mode { get; set; }
        [Order(20)]
        public string ChargeTo { get; set; }
        [Order(21)]
        public string pBasis { get; set; }
        [Order(22)]
        public string sBasis { get; set; }
        [Order(23)]
        public string Remarks { get; set; }
        [Order(24)]
        public string WaveoffRemarks { get; set; }
        [Order(25)]
        public string DescriptionRemarks { get; set; }
        [Order(26)]
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

    [KnownType(typeof(AgentBranchCheque))]
    public class AgentBranchCheque
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AgentBranchSNo { get; set; }
        [Order(3)]
        public string BankSNo { get; set; }
        [Order(4)]
        public string BankName { get; set; }
        [Order(5)]
        public string BankBranch { get; set; }
        [Order(6)]
        public string ChequeNo { get; set; }
        [Order(7)]
        public string ChequeDate { get; set; }
        [Order(8)]
        public Decimal ChequeLimit { get; set; }
        [Order(9)]
        public decimal Availablelimit { get; set; }
        [Order(10)]
        public bool ChequeFreuency { get; set; }
    }


    //[KnownType(typeof(AWBCheque))]
    //public class AWBCheque
    //{
    //    [Order(1)]
    //    public string SNo { get; set; }
    //    [Order(2)]
    //    public string AWBSNo { get; set; }
    //    [Order(3)]
    //    public string AgentBranchSNo { get; set; }
    //    [Order(4)]
    //    public decimal Amount { get; set; }
    //    [Order(5)]
    //    public string PaymentMode { get; set; }
    //    [Order(6)]
    //    public string InvoiceSNo { get; set; }
    //    [Order(7)]
    //    public string InvoiceNo { get; set; }
    //}

    [KnownType(typeof(CheckListTrans))]
    public class CheckListTrans
    {
        [Order(1)]
        public string CheckListDetailSNo { get; set; }
        [Order(2)]
        public string CheckListTypeSNo { get; set; }
        [Order(3)]
        public string SPHCSNo { get; set; }
        [Order(4)]
        public string Status { get; set; }
        [Order(5)]
        public string AWBSNo { get; set; }
        [Order(6)]
        public string EnteredBy { get; set; }
        [Order(7)]
        public string Remarks { get; set; }
        [Order(8)]
        public string Column1 { get; set; }
        [Order(9)]
        public string Column2 { get; set; }
        [Order(10)]
        public string Column3 { get; set; }
    }

    [KnownType(typeof(FooterArray))]
    public class FooterArray
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string SPHCSNo { get; set; }
        [Order(3)]
        public string Comment { get; set; }
        [Order(4)]
        public string CheckedBy { get; set; }
        [Order(5)]
        public string Station { get; set; }
        [Order(6)]
        public string Name { get; set; }
        [Order(7)]
        public string Time { get; set; }
        [Order(8)]
        public string Date { get; set; }
        [Order(9)]
        public string ShipperAgent { get; set; }
    }

    [KnownType(typeof(AWBEDoxDetail))]
    public class AWBEDoxDetail
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

    [KnownType(typeof(SPHCDoxArray))]
    public class SPHCDoxArray
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


    [KnownType(typeof(GetDimemsionsAndULDNew))]
    public class GetDimemsionsAndULDNew
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int HAWBSNo { get; set; }
        public int NoOfPieces { get; set; }
        public string WeightCode { get; set; }
        public Nullable<Decimal> GrossWeight { get; set; }
        public Nullable<Decimal> hdnVolWeight { get; set; }
        public string RateClassCode { get; set; }
        public string HdnRateClassCode { get; set; }
        public int CommodityItemNumber { get; set; }
        public Nullable<Decimal> ChargeableWeight { get; set; }
        public Nullable<Decimal> Charge { get; set; }
        public Nullable<Decimal> ChargeAmount { get; set; }
        public string HarmonisedCommodityCode { get; set; }
        public int HdnCountry { get; set; }
        public string Country { get; set; }
        public string NatureOfGoods { get; set; }
        public string ConsolDesc { get; set; }
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

    [KnownType(typeof(AWBOtherChargeArray))]
    public class AWBOtherChargeArray
    {
        [Order(1)]
        public int AWBSNo { get; set; }
        [Order(2)]
        public string Type { get; set; }
        [Order(3)]
        public string OtherChargeCode { get; set; }
        [Order(4)]
        public string DueType { get; set; }
        [Order(5)]
        public string ChargeAmount { get; set; }
    }

    [KnownType(typeof(SummaryArray))]
    public class SummaryArray
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

    [KnownType(typeof(AWBRateArray))]
    public class AWBRateArray
    {
        [Order(1)]
        public string AWBCurrencySNo { get; set; }
        [Order(2)]
        public string TotalPrepaid { get; set; }
        [Order(3)]
        public string TotalCollect { get; set; }
        [Order(4)]
        public string CVDCurrency { get; set; }
        [Order(5)]
        public string CVDChargeCode { get; set; }
        [Order(6)]
        public string CVDWeightValuation { get; set; }
        [Order(7)]
        public string CVDOtherCharges { get; set; }
        [Order(8)]
        public string CVDDCarriageValue { get; set; }
        [Order(9)]
        public string CVDCustomValue { get; set; }
        [Order(10)]
        public string CVDInsurence { get; set; }
        [Order(11)]
        public string CVDValuationCharge { get; set; }
        [Order(12)]
        public string CDCCurrency { get; set; }
        [Order(13)]
        public string CDCConversionRate { get; set; }
        [Order(14)]
        public string CDCDestCurrency { get; set; }
        [Order(15)]
        public string CDCChargeAmount { get; set; }
        [Order(16)]
        public string CDCTotalCharAmount { get; set; }

    }

    [KnownType(typeof(TactRateArray))]
    public class TactRateArray
    {
        [Order(1)]
        public string AWBSNo { get; set; }
        [Order(2)]
        public string BaseOn { get; set; }
        [Order(3)]
        public string ChargeableWeight { get; set; }
        [Order(4)]
        public string CommodityItemNumber { get; set; }
        [Order(5)]
        public string GrossWeight { get; set; }
        [Order(6)]
        public string NatureOfGoods { get; set; }
        [Order(7)]
        public string NoOfPieces { get; set; }
        [Order(8)]
        public string RateClassCode { get; set; }
        [Order(9)]
        public string Charge { get; set; }
        [Order(10)]
        public string ChargeAmount { get; set; }
        [Order(11)]
        public string WeightCode { get; set; }

    }

    [KnownType(typeof(FlightPlanDetails))]
    public class FlightPlanDetails
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public int Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string OrginAirport { get; set; }
        public string DestinationAirport { get; set; }

    }

    [KnownType(typeof(AcceptanceGetWebForm))]
    public class AcceptanceGetWebForm
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string Action { get; set; }
        public string IsSubModule { get; set; }
    }

}