using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Master
{
    /*
    *****************************************************************************
    Class Name:		Account      
    Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
    Company:		CargoFlash 
    Author:			Madhav Kumar Jha
    Created On:		24 Feb 2014
    Approved By:    
    Approved On:	
    *****************************************************************************
    */

    [KnownType(typeof(Account))]
    public class Account
    {

        /// <summary>
        /// SNo is primary value in Entity Account
        /// </summary>
        public Int32 SNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int ParentID { get; set; }

        //public string Text_ParentID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int AirlineSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_AirlineSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AirlineCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int AccountTypeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_AccountTypeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int OfficeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_OfficeSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int CitySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_CitySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CityCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CityName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Address { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AgentAccountNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int CurrencySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CurrencyCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Text_CurrencySNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IATANo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 

        // public string vendorcode { get; set; }
        public string CASSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsAllowedCL { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AllowedCL { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsAllowedConsolidatedCL { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AllowedConsolidatedCL { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidFrom { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<DateTime> ValidTo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public bool IsActive { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Active { get; set; }
        /// <summary>
        /// 
        /// </summary>

        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> CreditLimit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> BankGuarantee { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> Payment { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> MinimumCL { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> UsedCL { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public Nullable<Decimal> AlertCLPercentage { get; set; }

        
        public bool SMS { get; set; }
        public bool Message { get; set; }
        public string Mobile { get; set; }
        public String Email { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CreatedBy { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UpdatedBy { get; set; }

        public bool IsHeadAccount { get; set; }
        public string HeadAccount { get; set; }
        public string Branch { get; set; }
        public string Text_Branch { get; set; }
        public string AccountNo { get; set; }
        public string BillingCode { get; set; }
        public bool IsWarehouse { get; set; }
        public string Warehouse { get; set; }
        public int InvoicingCycle { get; set; }
        public string Text_InvoicingCycle { get; set; }

        // add FreightCycle by umar //
        public int FreightInvoicingCycle { get; set; }
        public string Text_FreightInvoicingCycle { get; set; }
        // End //

        public bool IsBlacklist { get; set; }
        public string Blacklist { get; set; }
        public bool ForwarderAsConsignee { get; set; }
        public string Text_ForwarderAsConsignee { get; set; }
        public int isCL { get; set; }

        public string DisplayName { get; set; }
        public int IsVendorType { get; set; }
        public string VendorType { get; set; }

        public string RegulatedAgentRegNo { get; set; }
        public Nullable<DateTime> AgentRegExpirydate { get; set; }

        public string CustomCode { get; set; }
        //added by tarun kumar singh
        public string AccountCode { get; set; }
        public string VAccountNo { get; set; }
        //


        public string BankIntegrate { get; set; }

        #region Sachin Change // 26-12-2016

        public Int16 CustomerTypeSNo { get; set; }

        public Int16 TransactionTypeSNo { get; set; }
        public int? CountrySNo { get; set; }
        public int? IndustryTypeSNO { get; set; }
        public string RARegistrationNo { get; set; }
        public Nullable<DateTime> RARegistrationExpDate { get; set; }
        public bool ConsolidateInvoicing { get; set; }
        public bool ConsolidateStock { get; set; }
        public string ParticipantID { get; set; }
        public string ERPCode { get; set; }
        public bool StockType { get; set; }

        public string GarudaMile { get; set; }


        public int LoginColorCodeSno { get; set; }

        public string Text_LoginColorCodeSno { get; set; }
        public int? BusinessTypeSno { get; set; }

        public string Text_BusinessTypeSno { get; set; }

        public int? RateMarkUp { get; set; }
        public string Text_CustomerTypeSNo { get; set; }

        public string Text_TransactionTypeSNo { get; set; }

        public string Text_CountrySNo { get; set; }

        public string Text_IndustryTypeSNO { get; set; }

        public string StockTypEActive { get; set; }

        public string ConsolidateInvoicingActive { get; set; }

        public string ConsolidateStockActive { get; set; }
        public int? IsAutoStock { get; set; }
        public string AutoStock { get; set; }
        public int? NumOfDueDays { get; set; }
        public string Remarks { get; set; }
        public bool VatExempt { get; set; }
        public string Text_VatExempt { get; set; }

        public Nullable<Decimal> ORCPercentage { get; set; }

        public int NoofReplan { get; set; }
        public string OtherAirlineSNo { get; set; }
        public string Text_OtherAirlineSNo { get; set; }
        public bool IsAsAgreed { get; set; }
        /// <summary>
        ///  added by devendra on 12 jan 2018
        /// </summary>
        public string Text_IsAsAgreed { get; set; }
        /// <summary>
        ///added by devendra on 12 jan 2018 
        /// </summary>
        #endregion
        //added by Pankaj Kumar Ishwar
        public string GSTNumber { get; set; }
      

        public string GSTBillingAddress { get; set; }
        public string DefaultGSTNumber { get; set; }


        public string DefaultGSTBillingAddress { get; set; }
        public string RegisteredCompanyName { get; set; }
        public bool VisibilityofPriority { get; set; }
        public string Text_VisibilityofPriority { get; set; }
        public int? SplitShipmentAllowed { get; set; }
        public string Text_SplitShipmentAllowed { get; set; }
        public string IATA { get; set; }
        // Added By Devendra 22 June 2018
        public int? AWBPrintAllowedHour { get; set; }
        public int? AWBLabelAllowedHour { get; set; }
        public List<OtherAirlines> OtherAirlinesSlab { get; set; }
        public string OfficeTypeName { get; set; }
        // Added by Umar on 19-Feb-2019
        public bool IsExcludeBankGuarantee { get; set; }

    }

    [KnownType(typeof(AccountTarget))]
    public class AccountTarget
    {
        public int SNo { get; set; }
        public int AirportSNo { get; set; }
        public string Text_AirportSNo { get; set; }
        public string AirportName { get; set; }

        public int? AccountSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public string Name { get; set; }
        public string TargetName { get; set; }
        public int ProductSNo { get; set; }
        public string Text_ProductSNo { get; set; }
        public string ProductName { get; set; }
        public int TargetType { get; set; }
        public Nullable<int> FlightTypeSNo { get; set; }
        public string Text_FlightTypeSNo { get; set; }
        public string FlightType { get; set; }

        public int NoOfFlight { get; set; }
        public int CurrencySNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public string CurrencyCode { get; set; }

        public bool IsActive { get; set; }
        public String Active { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public string TargetTypeDisplay { get; set; }

    }

    [KnownType(typeof(AccountCommission))]
    public class AccountCommission
    {
        public int SNo { get; set; }
        public int AccountSNo { get; set; }

        public int CommisionType { get; set; }

        public Decimal CommisionAmount { get; set; }

        public int IncentiveType { get; set; }

        public Decimal IncentiveAmount { get; set; }

        public string NetNetCommision { get; set; }

        public string AccountCommisionType { get; set; }

        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }

        public int IsActive { get; set; }

        public string Active { get; set; }

        public string CreatedBy { get; set; }


        public string UpdatedBy { get; set; }

        public string DisPlayCommisionType { get; set; }
        public string DisPlayIncentiveType { get; set; }





    }

    [KnownType(typeof(AccountCollection))]
    public class AccountCollection
    {
        public List<Account> account { get; set; }
    }

    [KnownType(typeof(AccountVatExempt))]
    public class AccountVatExempt
    {
        public int SNo { get; set; }

        public int AccountSNo { get; set; }

        public string Text_AccountSNo { get; set; }

        public string AccountName { get; set; }

        public bool IsDomsticVatExempt { get; set; }

        public Decimal Value { get; set; }

        public string ValidFrom { get; set; }

        public string ValidTo { get; set; }

        public Boolean IsActive { get; set; }

        public string Active { get; set; }
        public string Town { get; set; }
        public string Telex { get; set; }
        public string DomsticVatExempt { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(ContactInformation))]
    public class ContactInformation
    {
        public int SNo { get; set; }
        public int AccountSNo { get; set; }
        // public string Name { get; set; }
        // public string Name2 { get; set; }
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Designation { get; set; }
        public string Position { get; set; }
        public string MobileNo { get; set; }
        public string EmailId { get; set; }
        public string FaxNumber { get; set; }
        public string State { get; set; }
        public string District { get; set; }
        public string SubDistrict { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string Town { get; set; }
        public string PostalCode { get; set; }
        public string Telex { get; set; }
        public string CountryName { get; set; }
        public string HdnCountryName { get; set; }
        public string CityName { get; set; }
        public string HdnCityName { get; set; }
        public string Active { get; set; }
        public string IsActive { get; set; }
        public string Off_EmailId { get; set; }
    }

    [KnownType(typeof(Branch))]
    public class Branch
    {
        public int SNo { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public decimal CreditLimit { get; set; }
        public decimal RemainingCreditLimit { get; set; }
        public decimal MasterRCL { get; set; }
        public decimal MasterCreditLimit { get; set; }
        public decimal TotalCreditLimit { get; set; }
        public decimal UtilizedCL { get; set; }
    }
    [KnownType(typeof(AccountTargetCommTrans))]
    public class AccountTargetCommTrans
    {
        public int SNo { get; set; }
        public int AccountTargetSNo { get; set; }
        public int CommisionType { get; set; }
        public string CommisionTypeAccount { get; set; }
        public Nullable<Decimal> CommisionValue { get; set; }
        public Nullable<Decimal> TargetStartValue { get; set; }
        public Nullable<Decimal> TargetEndValue { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
    }
    [KnownType(typeof(AccountTargetPenaltyTrans))]
    public class AccountTargetPenaltyTrans
    {
        public int SNo { get; set; }
        public int AccountTargetSNo { get; set; }
        public int PenaltyType { get; set; }
        public string PenaltyOfficeType { get; set; }
        public Nullable<Decimal> PenaltyValue { get; set; }
        public Nullable<Decimal> TargetStartValue { get; set; }
        public Nullable<Decimal> TargetEndValue { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
    }
    [KnownType(typeof(BranchCreditLimit))]
    public class BranchCreditLimit
    {
        public int SNo { get; set; }
        public decimal CreditLimit { get; set; }
    }


 [KnownType(typeof(OtherAirlines))]
    public class OtherAirlines
    {
        public int SNo { get; set; }
        public string AirlineSNo{ get; set; }
        public int HdnAirlineSNo { get; set; }
        public Int64 AccountSNo { get; set; }
        public string ReferenceNumber { get; set; }

    }
}
