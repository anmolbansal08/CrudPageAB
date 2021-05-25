using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Rate
{
    [KnownType(typeof(CampaignUtilisationReport))]
    public class CampaignUtilisationReport
    {
        public int SNo { get; set; }
        public string Code { get; set; }
        public string AirlineSNo { get; set; }
        public string IsApproved { get; set; }
        public string CreatedBy { get; set; }
        public string ApprovedBy { get; set; }
        public string ReferenceNo { get; set; }

        public string RSPRate { get; set; }
        public string RequestedRate { get; set; }
        public string ApprovedRate { get; set; }

        public string NoOfCode { get; set; }
        public string UtilizedAWB { get; set; }

        public string AppliedCode { get; set; }
        public string Remaining { get; set; }
        
        public string AgentName { get; set; }
        public string AWBNo { get; set; }
        // Add field by UMAR On 30-10-2018
        public string CommodityDescription { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string ProductName { get; set; }
        public string TotalChargeableWeight { get; set; }
        public string SHCCodeName { get; set; }
        public string FlightDate { get; set; }
        public string FLightNo { get; set; }
        // End
        public string CodeUsed { get; set; }
        public string AppliedBy { get; set; }



    }


  [KnownType(typeof(CampaignUtilisationRequestModel))]
  public class  CampaignUtilisationRequestModel
    {
        public int IsAutoProcess { get; set; }
        public string AirlineCode{get;set;}
        public string CampaignCode{get;set;}
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int OfficeSNo { get; set; }
        public int AgentSNo { get; set; }
        public int CodeType { get; set; }
        public int Status { get; set; }
    }
    //[KnownType(typeof(CampaignUtilisationReportChild))]
    //public class CampaignUtilisationReportChild
    //{
    //    public int SNo { get; set; }
    //    public string Code { get; set; }      
    //    public string RSPRate { get; set; }
    //    public string RequestedRate { get; set; }
    //    public string ApprovedRate { get; set; }
    //    public string IsApproved { get; set; }
    //    public string CreatedBy { get; set; }
    //    public string ApprovedBy { get; set; }

    //}


}
