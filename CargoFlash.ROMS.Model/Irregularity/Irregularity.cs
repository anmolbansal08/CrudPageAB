using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Irregularity
{
    [KnownType(typeof(Irregularity))]
    public class Irregularity
    {
        public int SNo { get; set; }
        public int IncidentCategorySNo { get; set; }
        public string IncidentCategory { get; set; }
        public string IncidentCategoryCode { get; set; }
        public string Text_IncidentCategory { get; set; }
        public int ReportingStationSNo { get; set; }
        public string ReportingStation { get; set; }
        public string Text_ReportingStation { get; set; }
        public long AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string Text_AWBNo { get; set; }
        public string IrregularityStatus { get; set; }
        public bool Status { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string LabelType { get; set; }
        public bool IsAWBLabel { get; set; }
        public int Type { get; set; }
        public string FlightNo { get; set; }
        public Nullable<DateTime> FlightDate { get; set; }
        public string OriginAirportCode { get; set; }
        public string DestinationAirportCode { get; set; }
        public string Commodities { get; set; }
        public string SHC { get; set; }
        public string Agent { get; set; }
        public string Shipper { get; set; }
        public string Consignee { get; set; }
        public string UpdatedUser { get; set; }
        public string FreightType { get; set; }
        public string NatureOfGoods { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWeight { get; set; }
        public string RemainingPcs { get; set; }
        public string tabCount { get; set; }
        public string AssignTo { get; set; }
        public string POMailSNo { get; set; }
        public string CN38No { get; set; }

        public string DailyFltSNo { get; set; }
        public string ReferenceCode { get; set; }
        
    }

    [KnownType(typeof(IrregularityTrans))]
    public class IrregularityTrans
    {
        public int SNo { get; set; }
        public int IrregularityTransSNo { get; set; }
        public int IrregularitySNo { get; set; }
        public string GridType { get; set; }
        public string HAWBNo { get; set; }
        public int Pieces { get; set; }
        public Decimal Weight { get; set; }
        public string Dimensions { get; set; }
        public string HdnPacking { get; set; }
        public string Packing { get; set; }
        public string HdnPilferageDiscovered { get; set; }
        public string PilferageDiscovered { get; set; }
        public string HdnDamageDiscovered { get; set; }
        public string DamageDiscovered { get; set; }
        public string HdnDamageType { get; set; }
        public string DamageType { get; set; }
        public string IsInspected { get; set; }
        public string HdnContentType { get; set; }
        public string ContentType { get; set; }
        public int Reason { get; set; }
        public string IdentificationRemarks { get; set; }
        public string Value { get; set; }
        public string IrregularityStatusSNo { get; set; }
        public string IsReport { get; set; }
        public string ReportDate { get; set; }
        public string Place { get; set; }
        public string Action { get; set; }
        public string HdnPlace { get; set; }
        public string Remarks { get; set; }
        public string PoliceReportFilePath { get; set; }
        public string ClosingRemarks { get; set; }
        public string ClosingFlightNo { get; set; }
        public string ClosingFlightDate { get; set; }
        public string OnHold { get; set; }
        public string OnHoldSince { get; set; }
        public string UnHoldAt { get; set; }
        public string IsMisrouted { get; set; }
        public string NonDeliveryReasonSNo { get; set; }
        public string AlternateDeliveryAddress { get; set; }
        public string DisposalAdviceSNo { get; set; }
        public string DateOfShipmentDestruction { get; set; }
        public string CostOfShipmentDestruction { get; set; }
        public string DateOfShipmentAuction { get; set; }
        public string AmountRecoveredFromAuction { get; set; }
        public string HdnStatus { get; set; }
        public string Status { get; set; }
        public string IncidentCategory { get; set; }
        public string IsAWBLabel { get; set; }
        public string Attachment { get; set; }
        public string HdnPieces { get; set; }
        public string HdnHAWBNo { get; set; }
        public string HAWBPcs { get; set; }
        public string HdnRecuperation { get; set; }
        public string Recuperation { get; set; }

    }


    [KnownType(typeof(IrregularityTransDimension))]
    public class IrregularityTransDimension
    {
        public int SNo { get; set; }
        public int IrregularityTransSNo { get; set; }
        public int IrregularitySNo { get; set; }
        public Decimal Length { get; set; }
        public Decimal Width { get; set; }
        public Decimal Height { get; set; }
        public string MeasurementUnit { get; set; }
    }
    /// <summary>
    /// tarun k singh
    /// for irre response
    /// </summary>
    [KnownType(typeof(IrregularityResponse))]
    public class IrregularityResponse
    {
        public int SNo { get; set; }
        public int IrregularityTracingSNo { get; set; }
        public int HdnResponse { get; set; }
        public string Response { get; set; }
        public string Remarks { get; set; }
        public string imgurl { get; set; }
        public string User { get; set; }
        public string ResponseDateTime { get; set; }
        public string Station { get; set; }
    }

    /// <summary>
    /// irre resoponse req by tarun k singh
    /// 12-01-2018
    /// </summary>
    
    public class IrregularityResponseRequest
    {
        public int IrrTracingSNo { get; set; }
        
    }
    [KnownType(typeof(IrregularityIncidentCategoryDimension))]
    public class IrregularityIncidentCategoryDimension
    {
        public int SNo { get; set; }
        public string HAWBNo { get; set; }
        public int Pieces { get; set; }
        public Decimal? Weight { get; set; }
        public int EventSNo { get; set; }
        public int PackingSNo { get; set; }
        public int DamageSNo { get; set; }
        public int IsInspected { get; set; }
        public int ContentType { get; set; }
        public int Reason { get; set; }
        public string IdentificationRemarks { get; set; }
        public Decimal? EstimatedValue { get; set; }
        public int IrregularityStatusSNo { get; set; }
        public bool? PoliceReportFiled { get; set; }
        public string PoliceReportFilingDate { get; set; }
        public string PoliceReportFilingPlace { get; set; }
        public string PoliceReportFilingRemarks { get; set; }
        public string PoliceReportFilePath { get; set; }
        public string ClosingRemarks { get; set; }
        public string ClosingFlightNo { get; set; }
        public DateTime? ClosingFlightDate { get; set; }
        public bool? OnHold { get; set; }
        public DateTime? OnHoldSince { get; set; }
        public DateTime? UnHoldAt { get; set; }
        public bool? IsMisrouted { get; set; }
        public int NonDeliveryReasonSNo { get; set; }
        public string AlternateDeliveryAddress { get; set; }
        public int DisposalAdviceSNo { get; set; }
        public DateTime? DateOfShipmentDestruction { get; set; }
        public Decimal? CostOfShipmentDestruction { get; set; }
        public DateTime? DateOfShipmentAuction { get; set; }
        public Decimal? AmountRecoveredFromAuction { get; set; }
        public int RecuperationSNo { get; set; }
        public string hdnChildData { get; set; }
    }

    [KnownType(typeof(SaveActionNew))]
    public class SaveActionNew
    {
        public int ActionCode { get; set; }
        public string Text_ActionCode { get; set; }
        public string Date { get; set; }
        public string Remarks { get; set; }
        public Decimal? Amount { get; set; }
        public int IrregularitySNo { get; set; }
    }



    public class IrregularityRequest
    {
        public int UploadSNo { get; set; }
        public int transSno { get; set; }
    }

    public class IrregularityCreate 
    {
        public string IncidentCategory { get; set; }
        public string IsAWBLabel { get; set; }

    }


}
