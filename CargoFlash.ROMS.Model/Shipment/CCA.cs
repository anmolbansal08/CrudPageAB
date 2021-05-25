using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(CCA))]
    public class CCA
    {
        public int SNo { get; set; }
        public string CCANo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AgentName { get; set; }
        public string CreatedBy { get; set; }
        public string Status { get; set; }



        //SNo,CCANo,AWBNom,Origin,Destination,AgentName,Status,IsApproved,CreatedBy,AccountSno
    }
    [KnownType(typeof(CCAGrid))]
    public class CCAGrid
    {
        public int SNo { get; set; }
        public string CCANo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AgentName { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string ApprovedDate { get; set; }
        public string Status { get; set; }
        public string CCAStatus { get; set; }
        public string CCAGeneratedStatus { get; set; }
        public string PendingDays { get; set; }
        public string IsCCADoc { get; set; }

    }
    [KnownType(typeof(AWBOtherCharges))]
    public class AWBOtherCharges
    {
        public string OtherChargeCode { get; set; }
        public string HdnOtherChargeCode { get; set; }
        public string ChargeAmount { get; set; }

        public string CCAType { get; set; }
        public string Type { get; set; }
        public string HdnCCAType { get; set; }



        public string AWBSNO { get; set; }
    }



    //Save CCA And CCAOTHERCHARGE


    [KnownType(typeof(SaveCCA))]
    public class SaveCCA
    {
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        //public string CCANo { get; set; }
        public string CCARemarks { get; set; }
        public string RevisedFreightType { get; set; }
        public string OriginalFreightType { get; set; }
        public string RevisedPWeightCharges { get; set; }
        public string OriginalPWeightCharges { get; set; }
        public string RevisedCWeightCharges { get; set; }
        public string OriginalCWeightCharges { get; set; }
        public string RevisedPValuationCharges { get; set; }
        public string OriginalPValuationCharges { get; set; }
        public string RevisedCValuationCharges { get; set; }
        public string OriginalCValuationCharges { get; set; }
        public string RevisedPTax { get; set; }
        public string OriginalPTax { get; set; }
        public string RevisedCTax { get; set; }
        public string OriginalCTax { get; set; }
        public string RevisedPDueAgentCharges { get; set; }
        public string RevisedCDueAgentCharges { get; set; }
        public string OriginalPDueAgentCharges { get; set; }
        public string OriginalCDueAgentCharges { get; set; }
        public string RevisedPDueCarrierCharges { get; set; }
        public string RevisedCDueCarrierCharges { get; set; }
        public string OriginalPDueCarrierCharges { get; set; }
        public string OriginalCDueCarrierCharges { get; set; }
        //public string RevisedCCFee { get; set; }
        //public string OriginalCCFee { get; set; }
        public string RevisedPTotalCharges { get; set; }
        public string RevisedCTotalCharges { get; set; }
        public string OriginalPTotalCharges { get; set; }
        public string OriginalCTotalCharges { get; set; }
        public string CurrencyCode { get; set; }
        public string IsApproved { get; set; }
        //public string ShowCCA { get; set; }
        public string ApprovedRemarks { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        //public string ApprovedBy { get; set; }
        public string ApprovedDate { get; set; }
        public string RevisedPieces { get; set; }
        public string OriginalPieces { get; set; }
        public string RevisedGrossWeight { get; set; }
        public string OriginalGrossWeight { get; set; }
        public int AccountSno { get; set; }
        public string RevisedWeightUnit { get; set; }
        public string OriginalWeightUnit { get; set; }
        public string RevisedVolume { get; set; }
        public string OriginalVolume { get; set; }
        //public string OriginalTariffRate { get; set; }
        //public string RevisedTariffRate { get; set; }
        //public string OriginalGSARate { get; set; }
        //public string RevisedGSARate { get; set; }
        public string RevisedChargeableWeight { get; set; }
        public string OriginalChargeableWeight { get; set; }
        public string shipper { get; set; }
        public string Consignee { get; set; }


        public int ISWEIGHTDISCREP { get; set; }
        public int ISVOLUMEDISCREP { get; set; }
        public int ISCNEECHANGE { get; set; }
        public int ISDESTCHANGE { get; set; }
        public int ISRATEERROR { get; set; }
        public int ISCCACHARGE { get; set; }



        public int RevisedCommoditySNo { get; set; }
        public int OriginalCommoditySNo { get; set; }
        public string RevisedSHCSNo { get; set; }
        public string OriginalSHCSNo { get; set; }
        public int RevisedProductSNo { get; set; }
        public int OriginalProductSNo { get; set; }

        public string RevisedVolumeWeight { get; set; }
        public string OriginalVolumeWeight { get; set; }

        public int ISSHCCHARGE { get; set; }
        public int ISPRODUCTCHARGE { get; set; }
        public int ISCOMMODITYCHARGE { get; set; }
        public int ISPIECESCHARGE { get; set; }

        public string Revisedshipper { get; set; }
        public string RevisedConsignee { get; set; }

        public int ISSHPRCHANGE { get; set; }
        public string OriginalNOG { get; set; }
        public string RevisedNOG { get; set; }
        public int ISNOGCHANGE { get; set; }





    }



    [KnownType(typeof(SaveCCAOtherCharges))]
    public class SaveCCAOtherCharges
    {
        //public string CCASNo { get; set; }
        public string AWBSNo { get; set; }
        public string Type { get; set; }
        public string DueType { get; set; }
        public string OtherChargeCode { get; set; }
        public string ChargeAmount { get; set; }
        //public string CreatedBy { get; set; }
        //public string CreatedOn { get; set; }
        //public string UpdatedBy { get; set; }
        //public string UpdatedOn { get; set; }
    }




    [KnownType(typeof(CCAReport))]
    public class CCAReport
    {
        public int SNo { get; set; }
        public string CCANo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string flightno { get; set; }
        public string CCAGrossWeight { get; set; }
        public string CCAPieces { get; set; }
        public string CCAVolume { get; set; }
        public string AgentName { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }

        public string UpdatedUser { get; set; }

    }




    [KnownType(typeof(SaveFlightRequestModel))]
    public class SaveFlightRequestModel
    {
        public string To { get; set; }
        public string FlightNo { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }

        public string Volume { get; set; }
        public string VolumeWeight { get; set; }
        public string Date { get; set; }

        public string DailyFlightSNo { get; set; }

    }

    [KnownType(typeof(CCACustomerTrans))]
    public class CCACustomerTrans
    {
        public int SNo { get; set; }
        public int CCASNo { get; set; }
        public int AWBSNo { get; set; }
        public int OriginalCustomerTypeSNo { get; set; }
        public int OriginalCustomerSNo { get; set; }
        public string Text_OriginalCustomerSNo { get; set; }

        public int OriginalCustomerAccountNo { get; set; }
        public string OriginalCustomerName { get; set; }
        public string OriginalStreet { get; set; }
        public string OriginalLocation { get; set; }
        public int OriginalCitySno { get; set; }
        public string Text_OriginalCitySno { get; set; }
        public int OriginalCountrySno { get; set; }
        public string Text_OriginalCountrySno { get; set; }
        public string OriginalState { get; set; }
        public string OriginalPostalCode { get; set; }
        public string OriginalPhone { get; set; }
        public string OriginalFax { get; set; }
        public string OriginalEmail { get; set; }
        public int RevisedCustomerTypeSNo { get; set; }
        public int RevisedCustomerSNo { get; set; }
        public int RevisedCustomerAccountNo { get; set; }
        public string Text_RevisedCustomerSNo { get; set; }
        public string RevisedCustomerName { get; set; }
        public string RevisedStreet { get; set; }
        public string RevisedLocation { get; set; }
        public int RevisedCitySno { get; set; }
        public string Text_RevisedCitySno { get; set; }
        public int RevisedCountrySno { get; set; }
        public string Text_RevisedCountrySno { get; set; }
        public string RevisedState { get; set; }
        public string RevisedPostalCode { get; set; }
        public string RevisedPhone { get; set; }
        public string RevisedFax { get; set; }
        public string RevisedEmail { get; set; }
        public string OriginalCustomerName2 { get; set; }
        public string RevisedCustomerName2 { get; set; }
        public string OriginalStreet2 { get; set; }
        public string RevisedStreet2 { get; set; }
        public string OriginalPhone2 { get; set; }
        public string RevisedPhone2 { get; set; }
    }
    /// <summary>
    /// created by : arman Ali 3/20/209 other charges on CCA
    /// </summary>
    [KnownType(typeof(DueCarrierOtherChargeCCA))]
    public class DueCarrierOtherChargeCCA
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int BookingSNo { get; set; }
        public string BookingRefNo { get; set; }
        public int Type { get; set; }
        public string OtherChargeCode { get; set; }
        public string OtherchargeDetail { get; set; }
        public string OtherchargeCurrency { get; set; }
        public decimal ChargeValue { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }

    }
    
    [KnownType(typeof(DueAgentOtherChargeCCA))]
    public class DueAgentOtherChargeCCA
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int BookingSNo { get; set; }
        public string BookingRefNo { get; set; }
        public int Type { get; set; }
        public string OtherChargeType { get; set; }
        public string OtherChargeCode { get; set; }
        public string OtherchargeDetail { get; set; }
        public string AgentOtherchargeCurrency { get; set; }
        public string HdnAgentOtherchargeCurrency { get; set; }
        public decimal ChargeValue { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }

    }
}
