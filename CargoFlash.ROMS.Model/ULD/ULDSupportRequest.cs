using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDSupportRequest))]
    public class ULDSupportRequest
    {
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string ReferenceNo { get; set; }
        [Order(3)]
        public string ReqByAirport { get; set; }
        [Order(4)]
        public string ReqToAirport { get; set; }
        [Order(5)]
        public string EmailAddress { get; set; }
        [Order(6)]
        public string ReqStatus { get; set; }
        [Order(7)]
        public string UserName { get; set; }
        [Order(8)]
        public Nullable<DateTime> CreatedOn { get; set; }
        [Order(9)]
        public string ProcessStatus { get; set; }
        [Order(10)]
        public string Remarks { get; set; }

    }

    [KnownType(typeof(ULDSRequest))]
    public class ULDSRequest
    {
        [Order(1)]
        public int SNo { get; set; }
        [Order(2)]
        public string ReferenceNo { get; set; }
        [Order(3)]
        public string ReqByAirport { get; set; }
        [Order(4)]
        public string ReqToAirport { get; set; }
        [Order(5)]
        public string EmailAddress { get; set; }
    }

    [KnownType(typeof(ULDSRequestedDetail))]
    public class ULDSRequestedDetail
    {

        public int SNo { get; set; }

        public string ReferenceNo { get; set; }

        public string ReqByAirport { get; set; }

        public string ReqToAirport { get; set; }

        public string EmailAddress { get; set; }
        public string ULDType { get; set; }
        public int Qty { get; set; }
        public int CreatedBy { get; set; }
        public string Remarks { get; set; }

    }

    [KnownType(typeof(USRULDType))]
    public class USRULDType
    {
        public int SNo { get; set; }
        public string UldTypeSNo { get; set; }
        public string HdnUldTypeSNo { get; set; }
        public string Qty { get; set; }
    }
    [KnownType(typeof(USRConsumableType))]
    public class USRConsumableType
    {
        public int SNo { get; set; }
        public string ConsumableTypeSNo { get; set; }
        public string HdnConsumableTypeSNo { get; set; }
        public string CQty { get; set; }

    }
    [KnownType(typeof(USRAssigned))]
    public class USRAssigned
    {
        public int SNo { get; set; }
        public string AUldTypeSNo { get; set; }
        public string HdnAUldTypeSNo { get; set; }
        public string Qty { get; set; }
        public string AssignToAirportSNo { get; set; }
        public string HdnAssignToAirportSNo { get; set; }
    }
    [KnownType(typeof(USRProcessedRemarks))]
    public class USRProcessedRemarks
    {
        public int SNo { get; set; }
        public string Remark { get; set; }
    }
    [KnownType(typeof(USRProcessed))]
    public class USRProcessed
    {
        public int SNo { get; set; }
        public string PUldTypeSNo { get; set; }
        public string HdnPUldTypeSNo { get; set; }
        public string Qty { get; set; }
        public string AQty { get; set; }
        public string AssignToAirportSNo { get; set; }
        public string HdnAssignToAirportSNo { get; set; }
        public string Remark { get; set; }


    }
    [KnownType(typeof(USRClosedRemarks))]
    public class USRClosedRemarks
    {
        public int SNo { get; set; }
        public string CloseRemark { get; set; }
    }
    [KnownType(typeof(USRClosed))]
    public class USRClosed
    {
        public int SNo { get; set; }
        public string CUldTypeSNo { get; set; }
        public string HdnCUldTypeSNo { get; set; }
        public string Qty { get; set; }
        public string AQty { get; set; }
        public string AssignToAirportSNo { get; set; }
        public string HdnAssignToAirportSNo { get; set; }
        public string Remark { get; set; }
        public string CloseRemark { get; set; }
        public string InitiateRemarks { get; set; }
    }


    [KnownType(typeof(CheckULDAvailability))]
    public class CheckULDAvailability
    {
        public int SNo { get; set; }
        public string ULDCode { get; set; }
        public string City { get; set; }
        public string TotalULD { get; set; }
        public string RequiredULD { get; set; }
        public string Deviation { get; set; }
        public string DeviationPercentage { get; set; }
        public string AssignULD { get; set; }



        public string hdnULDCode { get; set; }

        public string hdnCity { get; set; }

        public string hdnCitySno { get; set; }

        public string ULDSNo { get; set; }

        public string Airport { get; set; }

        public string hdnAirport { get; set; }

        public string hdnAirportSno { get; set; }

        public int hdnTotalULD { get; set; }
    }
    public class WhereConditionAssign
    {
        public string ULDSNo { get; set; }

    }
}
