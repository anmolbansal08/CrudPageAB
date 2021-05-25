using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Master
{
    /*
  *****************************************************************************
  Class Name:		Office      
  Purpose:		    Used Traverse Structured data to Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
  Company:		    CargoFlash  Infotech Pvt ltd.
  Author:		    Badiuzzaman khan
  Created On:	    12 Feb 2014
  Approved By:    
  Approved On:	
  *****************************************************************************
  */

    /// <summary>
    /// Office Class use to create Master Data of Office
    /// </summary>
    [KnownType(typeof(Office))]
    public class Office
    {
        /// <summary>
        /// SNo is Primary Column of the Entity.
        /// </summary>
        public int SNo { get; set; }  //Not Null
     
        public int ParentID { get; set; }

        public string Text_ParentID { get; set; }
             
        /// <summary>
        /// 
        /// </summary>
        public string Name { get; set; } // NOT NULL,

        /* Author : chandra prakash singh 
          Modification Date  : 27/12/2016
          desc : remove property SitaAddress,RegulatedAgentRegNo,AgentRegExpirydate for company has no requirenment now
       */

        //public string SitaAddress { get; set; }
        public string CustomsOriginCode { get; set; }
        //public string RegulatedAgentRegNo { get; set; }
        //public Nullable<DateTime> AgentRegExpirydate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string Address { get; set; } // NULL

        /// <summary>
        /// CitySno in picked from City Entity 
        /// 
        /// </summary>
        public int CitySNo { get; set; } // NOT NULL,

        /// <summary>
        /// 
        /// </summary>
        public string CityCode { get; set; }// NOT NULL,

        /// <summary>
        /// 
        /// </summary>
        public string Text_CitySNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CityName { get; set; } // NULL,b


        public int AirportSNo { get; set; } // NOT NULL,

        /// <summary>
        /// 
        /// </summary>
        public string AirportCode { get; set; }// NOT NULL,

        /// <summary>
        /// 
        /// </summary>
        public string Text_AirportSNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string AirportName { get; set; } // NULL,b

        /// <summary>
        /// 
        /// </summary>
        public string CurrencySNo { get; set; } //NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public string CurrencyCode { get; set; }// NOT NULL,

        public string Text_CurrencySNo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string ERPCode { get; set; }// NULL,

        /// <summary>
        /// 
        /// </summary>
        /// 
      
        public Nullable<Decimal> Longitude { get; set; } //NULL,

        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> Latitude { get; set; }// NULL,
      
        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidFrom { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidTo { get; set; }// NULL

        /// <summary>
        /// IsSelf 
        /// </summary>
        public bool IsSelf { get; set; } // NULL,

        /// <summary>
        /// 
        /// </summary>
        public string Self { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool IsAllowedCL { get; set; }// NULL

        /// <summary>
        /// Property to used to show allowd cl on Text field
        /// </summary>
        public string AllowedCl { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public Boolean IsActive { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public string Active { get; set; }

        /// <summary>
        /// 
        /// </summary>
         
        // Add by Agent/Office on 04-jul-2018
        public bool AllowCreditLimitOnAgent { get; set; }

        public string CreditLimitOnAgent { get; set; }

        public bool AllowCreditLimitOfOffice { get; set; }

        public string CreditLimitOfOffice { get; set; }

        public int InvoicingCycle { get; set; }

        public string Text_InvoicingCycle { get; set; }

       // End

        public int CreatedBy { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public int UpdatedBy { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> CreditLimit { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> MinimumCL { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> BankGuarantee { get; set; } //  NULL

        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> AlertClPerCentage { get; set; } // NOT NULL

        public string UserCreatedBy { get; set; }

        public string UserUpdatedBy { get; set; } 

        public bool IsHeadOffice { get; set; }
        public string HeadOffice { get; set; }
        public string OfficeType { get; set; }
        public string Text_OfficeType { get; set; }
        /* Author : chandra prakash singh 
           Modification Date  : 27/12/2016
           desc : add property hidenOfficeType for set value of office type in edit mode
        */
        public string hidenOfficeType { get; set; }
      
        //Added by Akaram Ali on 18 Nov 2017
        public bool IsConsolidatedStock { get; set; }// NULL
        public string ConsolidatedStock { get; set; }
        //Added by Pankaj Kumar Ishwar on 16 Dec 2018
        public string GSTNumber { get; set; }
        public string Airline { get; set; }

        public bool SMS { get; set; }
        public bool Message { get; set; }
        public bool MessageCSR { get; set; }
        public string Mobile { get; set; }
        public String Email { get; set; }
        public String EmailID { get; set; }
        public int InvoiceDays { get; set; }// NULL,
        public int StockUtilization { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 


    }

    [KnownType(typeof(OfficeAirlineTrans))]
    public class OfficeAirlineTrans
    {

        public int SNo { get; set; }

        public int OfficeSNo { get; set; }
        public int HdnAirlineCode { get; set; }

        public string AirlineCode { get; set; }
        
        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }

        public Boolean IsActive { get; set; } 

        /// <summary>
        /// 
        /// </summary>
        public string Active { get; set; }
        public string FFM { get; set; }
        public int FFMStatus { get; set; } 
        public string FAASMSMobile { get; set; }
        public string FAAEmail { get; set; }
    }

    /// <summary>
    /// OfficeCommision Class used to Create office Commision of Particular office
    /// </summary>
    [KnownType(typeof(OfficeCommision))]
    public class OfficeCommision
    {
        public int SNo { get; set; }
        public int OfficeSNo { get; set; }
        //public string HDN_OfficeCommisionType { get; set; }

        public string OfficeCommisionType { get; set; }
        public int CommisionType { get; set; }

        public string CommisionTypeoffice { get; set; }

        public Nullable<Decimal> CommisionAmount { get; set; }

        public int IncentiveType { get; set; }

        public string OfficeIncentive { get; set; }
        public Nullable<Decimal> IncentiveAmount { get; set; }

        public Int16 NetNet { get; set; }

        public string NetNetCommision { get; set; }
        //public Nullable<DateTime> ValidFrom { get; set; }

        //public Nullable<DateTime> ValidTo { get; set; }


        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }
        public bool IsActive { get; set; }

        public string Active { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int CreatedBy { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public int UpdatedBy { get; set; } // NOT NULL

    }

    [KnownType(typeof(OfficeTarget))]
    public class OfficeTarget
    {
        public int SNo { get; set; }

        public int AirPortSNo { get; set; }

        public string AirportCode { get; set; }
        public  string  Text_AirPortSNo { get; set; }
        public int OfficeSNo { get; set; }

        public string Text_OfficeSNo { get; set; }

        public string OfficeName { get; set; }

        public int TargetType { get; set; }

        public string OfficeTargetType { get; set; }
        public string TargetName { get; set; }

        public int ProductSNo { get; set; }

        public string Text_ProductSNo { get; set; }

        public string ProductName { get; set; }

        public int FlightTypeSNo { get; set; }

        public string Text_FlightTypeSNo { get; set; }
        public int NoOfFlight { get; set; }

        public Decimal AverageWeightPerFlight { get; set; }
        public int CurrencySNo { get; set; }

        public string Text_CurrencySNo { get; set; }
        public string CurrencyCode { get; set; }


        public Nullable<DateTime> ValidFrom { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidTo { get; set; }// NULL
      


        public bool IsActive { get; set; }


        public string Active { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string   CreatedBy { get; set; } // NOT NULL

        /// <summary>
        /// 
        /// </summary>
        public string UpdatedBy { get; set; } // NOT NULL


        //public string UserCreatedBy { get; set; }

        //public string UserUpdatedBy { get; set; }
    }

    [KnownType(typeof(OfficeTargetCommTrans))]
    public class OfficeTargetCommTrans
    {
        public int SNo { get; set; }
        public int OfficeTargetSNo { get; set; }

        public int CommisionType { get; set; }

        public string CommisionTypeOffice { get; set; }
        public Nullable<Decimal> CommisionValue { get; set; }
        public Nullable<Decimal> TargetStartValue { get; set; }

        public Nullable<Decimal> TargetEndValue { get; set; }
        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }
    }

    [KnownType(typeof(OfficeTargetPenaltyTrans))]
    public class OfficeTargetPenaltyTrans
    {
        public int SNo { get; set; }
        public int OfficeTargetSNo { get; set; }

        public int PenaltyType { get; set; }

        public string PenaltyOfficeType { get; set; }

        public Nullable<Decimal> PenaltyValue { get; set; }
        public Nullable<Decimal> TargetStartValue { get; set; }

        public Nullable<Decimal> TargetEndValue { get; set; }
                
        public string ValidFrom { get; set; }

        public  string ValidTo { get; set; }

       


    }

    [KnownType(typeof(OfficeContactInformation))]
    public class OfficeContactInformation
    {
        public int SNo { get; set; }
        public int OfficeSNo { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public string MobileNo { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string CountryName { get; set; }
        public string HdnCountryName { get; set; }
        public string CityName { get; set; }
        public string HdnCityName { get; set; }
        public string Active { get; set; }
        public string IsActive { get; set; }
    }

      [KnownType(typeof(AcceptanceVariance))]
    public class AcceptanceVariance
    {
          public int? SNo { get; set; }
          public string AirlineCode { get; set; }
          public int HdnAirlineCode { get; set; }
          public decimal? FblFwbGrWt { get; set; }
          public decimal? FblFwbVolWt { get; set; }
          public decimal? FwbFohGrWt { get; set; }
          public decimal? FwbFohVolWt { get; set; }
          public decimal? FblFohGrWt { get; set; }
          public decimal? FblFohVolWt { get; set; }
          public string UpdatedOn { get; set; }
          public int? UpdatedBy { get; set; }
          public string OfficeSNo { get; set; }
          public string OfficeAirlineTransSNo { get; set; } 
    }
}
