using CargoFlash.SoftwareFactory.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Irregularity
{


    [KnownType(typeof(ClaimGrid))]
    public class ClaimGrid
    {
        public int ClaimSNo { get; set; }
        public string ClaimNumber { get; set; }
        public DateTime ClaimDate { get; set; }
        public string AWBNumber { get; set; }
        public string claimamount { get; set; }
        public int ClaimStatusSNo { get; set; }
        public string Name { get; set; }
        public string Remarks { get; set; }
        public string IsInternational { get; set; }
        public bool IsClosed { get; set; }
        public bool IsAssign { get; set; }
        public bool IsEdit { get; set; }
        public bool IsAction { get; set; }
        public bool IsEdox { get; set; }
        public bool IsAirlineEdox { get; set; }
    }


    [KnownType(typeof(ClaimNew))]
    public class ClaimNew
    {
        public int AWBNo { get; set; }
        public string Type { get; set; }
        public string Text_AWBNo { get; set; }
        public string Claimnumber { get; set; }
        public int ClaimSNo { get; set; }
        public int ClaimSourceSNo { get; set; }
        public int ClaimStatusSNo { get; set; }
        public string Text_ClaimStatusSNo { get; set; }
        public string Text_ClaimSourceSNo { get; set; }
        public int CitySNo { get; set; }
        public string RaisedDate { get; set; }
        public int HAWBNo { get; set; }
        public string  Text_HAWBNo { get; set; }
        public int ClaimTypeSNo { get; set; }
        public string Text_ClaimTypeSNo { get; set; }
        public string Pcs { get; set; }
        public string Weight { get; set; }
        public string Address { get; set; }
        public string EmailId { get; set; }
        public string Remarks { get; set; }
        public int WeightType { get; set; }
        public string ContactNo { get; set; }
        public string ClaimAmount { get; set; }
        public string Text_CitySNo { get; set; }
        public string Text_WeightType { get; set; }
        public int Currency { get; set; }
        public string Text_Currency { get; set; }
        public int  ClaimActionSNo { get; set; }
        public string Text_ClaimActionSNo { get; set; }
        public int ComplaintIrregularityList { get; set; }
        public string Text_ComplaintIrregularityList { get; set; }
        public string ClosedDate { get; set; }
        public string ClaimantName { get; set; }
        public int LoginCitySno { get; set; }
        
    }
    [KnownType(typeof(ClaimAssign))]
    public class ClaimAssign
    {
        public int ClaimSNo { get; set; }
        public string UserID { get; set; }
        public string AssignDate { get; set; }
        public string AssignMessage { get; set; }
        public string Text_UserID { get; set; }
        public string AssignCitySNo { get; set; }
        public string Text_AssignCitySNo { get; set; }
    }

    [KnownType(typeof(ClaimEDoxDetail))]
    public class ClaimEDoxDetail
    {
        [Order(1)]
        public int EDoxdocumenttypeSNo { get; set; }
        [Order(2)]
        public string DocName { get; set; }
        [Order(3)]
        public string AltDocName { get; set; }
        [Order(4)]
        public string ReferenceNo { get; set; }
        [Order(5)]
        public string Remarks { get; set; }
    }

    [KnownType(typeof(ClaimAmountDetails))]
    public class ClaimAmountDetails
    {
       
        public string AWBNo { get; set; }
        public string MKTFreight { get; set; }
        public string DeclaredCarriagevalue { get; set; }
        public string DeclaredCustomValue { get; set; }
        public string ValuationAmount { get; set; }
        public string InsauranceAmount { get; set; }
        public string OtherChargeValue { get; set; }
        public bool IsInsurance { get; set; }
        public bool IsVal { get; set; }
        public bool IsInternational { get; set; }
        public string SubrogationValue { get; set; }
        public bool IsPaid { get; set; }
        public string Maxliability { get; set; }

        public string AirlineParameterSDRrate { get; set; }

    }
    [KnownType(typeof(ClaimAction))]
    public class ClaimAction
    {
        public int ClaimSNo { get; set; }
        public int ClaimActionSNo { get; set; }
        public string ActionDate { get; set; }
        public string ActionDescription { get; set; }
        public string ClaimActionStatusSNo { get; set; }
        public bool IsNotify { get; set; }
        public string EmailId { get; set; }
        public string Text_ClaimActionSNo { get; set; }
        public string ClaimAmount { get; set; }

        public string InsuranceAmount { get; set; }
        public string InsuranceCompany { get; set; }
        public string Subrogationvalue { get; set; }
        public string ApprovedAmount { get; set; }
        public string RejectedReason { get; set; }
        public string Text_RejectedReason { get; set; }
        public string Maxliability { get; set; }
        public string IssuanceDate { get; set; }
        public string RemitanceDetails { get; set; }
        public string Rate { get; set; }

       
    }

    [KnownType(typeof(AWBDetails))]
    public class AWBDetails
    {
        //public int ClaimNumber { get; set; }
        //public int ClaimActionSNo { get; set; }
        public string AWBNumber { get; set; }
        public string TotalPieces { get; set; }
        public string TotalGrossWt { get; set; }
        public string TotalVolumeWT { get; set; }
        public string TotalAmount { get; set; }
        public string TotalTaxAmount { get; set; }
        public string MKTFreight { get; set; }
        public string OtherCharges { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public string ShipperName { get; set; }
        public string ShipperCity { get; set; }
        public string ConsigneeCity { get; set; }
        public string ConsigneeName { get; set; }
        public string AgentName { get; set; }
        public string AgentCity { get; set; }
        public string GrossUnit { get; set; }
        public string VolumeUnit { get; set; }
    }

    
[KnownType(typeof(ClaimWhereConditionModel))]
    public class ClaimWhereConditionModel
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string searchClaimNo { get; set; }
        public string searchClaimStatus { get; set; }
        public string searchAWBNo { get; set; }
        public string LoggedInCity { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string RecID { get; set; }

    }

    [KnownType(typeof(GetClaimGridData))]
   public class GetClaimGridData
    {
      
        public string searchClaimNo { get; set; }
        public string searchClaimStatus { get; set; }
        public string searchAWBNo { get; set; }
        public string LoggedInCity { get; set; }
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string RecID { get; set; }

    }
}
