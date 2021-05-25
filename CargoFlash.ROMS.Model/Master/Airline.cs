using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Master
{

    #region Airline Description
    /*
	*****************************************************************************
	Class Name:		Airline
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		22 Mar 2014
    Updated By:
	Updated On:
	Approved By:
	Approved On:
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(Airline))]

    public class Airline
    {

        public int SNo { get; set; }
        public String AirlineCode { get; set; }
        public String CarrierCode { get; set; }
        public String AirlineName { get; set; }
        public String AirportCodeSNo { get; set; }
        public String AirportCode { get; set; }
        public String ICAOCode { get; set; }
        public String Address { get; set; }
        public String CountrySNo { get; set; }
        public String CountryName { get; set; }
        public String SenderEmailId { get; set; }
        public String AirlineEmailId { get; set; }
        public string AirlineLogo { get; set; }
        public string AwbLogo { get; set; }
        public String AirlineWebsite { get; set; }
        public String MobileCountryCode { get; set; }
        public String MobileNo { get; set; }
        public String PhoneCountryCode { get; set; }
        public String CityPrefixCode { get; set; }
        public String PhoneNo { get; set; }
        public String CSDCode { get; set; }
        public bool IsActive { get; set; }
        public String CurrencySNo { get; set; }
        public String CurrencyCode { get; set; }
        public String CreatedBy { get; set; }
        public String UpdatedBy { get; set; }
        public String Active { get; set; }
        public String Text_AirportCode { get; set; }
        public String Text_CountryName { get; set; }
        public String Text_CurrencyCode { get; set; }
        public String ContactPerson { get; set; }
        public bool IsCCAllowed { get; set; }
        public String CCAllowed { get; set; }
        public bool IsPartAllowed { get; set; }
        public String PartAllowed { get; set; }
        public bool IsCheckModulus7 { get; set; }
        public String CheckModulus7 { get; set; }
        public string AWBDuplicacy { get; set; }
        public string HandlingInformation { get; set; }
        public string Interline { get; set; }
        public bool IsInterline { get; set; }
        public int InvoicingCycle { get; set; }
        public string Text_InvoicingCycle { get; set; }
        public string EmailAddress { get; set; }
        public string SitaAddress { get; set; }
        public int FOH_FWB { get; set; }


        public bool SMS { get; set; }
        public bool Message { get; set; }
        public string Mobile { get; set; }
        public String Email { get; set; }

        public bool IsAllowedCL { get; set; }
        public string AllowedCL { get; set; }
        public Nullable<Decimal> CreditLimit { get; set; }
        public Nullable<Decimal> MinimumCL { get; set; }
        public Nullable<Decimal> AlertCLPercentage { get; set; }
        public string AccountNo { get; set; }
        public string BillingCode { get; set; }
        public string BillingAddress { get; set; }
        //public String CsrPhone { get; set; }
        //public string ReportLogo { get; set; }
        //public String CityCode { get; set; }
        //public String Text_CityCode { get; set; }
        //public String Text_CurrencyCode { get; set; }
        //public bool IsDimensionAtBooking { get; set; }
        //public bool IsDimensionAtHandover { get; set; }
        //public bool IsPerPieceChecked { get; set; }
        //public bool IsCustomerCreation { get; set; }
        //public String CreatedByName { get; set; }
        //public String UpdatedByName { get; set; }
        //public Decimal MinimumCreditLimit { get; set; }
        //public int DomesticBookingDay { get; set; }
        //public int InternationalBookingDay { get; set; }
        //public String DimensionAtBooking { get; set; }
        //public String DimensionAtHandover { get; set; }
        //public String PerPieceChecked { get; set; }
        //public String CustomerCreation { get; set; }

        //public int InvoiceMode { get; set; }
        //public string Text_InvoiceMode { get; set; }

        public bool IsCashAirline { get; set; }
        public string CashAirline { get; set; }
        public int SCM { get; set; }
        public string Text_SCM { get; set; }
        public string SCMCycle { get; set; }
        public string Text_SCMCycle { get; set; }
        public string SCMDays { get; set; }
        public string Text_SCMDays { get; set; }
        public string PartnerAirline { get; set; }
        public string Text_PartnerAirline { get; set; }
        public int OverBookingCapacity { get; set; }
        public int FreeSaleCapacity { get; set; }
        public Nullable<decimal> Commission { get; set; }
        public int OverBookingCapacityVol { get; set; }
        public int FreeSaleCapacityVol { get; set; }
        public int AirlineMember { get; set; }
        public string Text_AirlineMember { get; set; }

        public string Text_AirlineSignatory { get; set; }
        public bool AirlineSignatory { get; set; }
        public Nullable<decimal> ISCPercentage { get; set; }
        public String SIS { get; set; }
        public int MaxStackContainer { get; set; }
        public int MaxStackPallets { get; set; }
        public string Text_UCMOutAlert { get; set; }
        public int UCMOutAlert { get; set; }
        public string Text_UCMinAlert { get; set; }
        public int UCMinAlert { get; set; }
        public string CountryRegistration { get; set; }
        public string VATRegistrationNumber { get; set; }
        public string SAPCustomeCode { get; set; }
        //public string UCMOutAlert { get; set; }
        //public string UCMinAlert { get; set; }
        public int ReserveCapacity { get; set; }
        public int ReserveCapacityVol { get; set; }
        // Added By Pankaj Kumar Ishwar
        public int DimensionMandatoryOn { get; set; }
        public string DimensionMandatory { get; set; }
        public bool IsHandled { get; set; }
        public string Handling { get; set; }
        public Int32 AirlineType { get; set; }
        public string Text_AirlineType { get; set; }
       
    }


    [KnownType(typeof(AirlineCCTrans))]
    public class AirlineCCTrans
    {
        public int SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string HdnCitySNo { get; set; }
        public string CitySNo { get; set; }
        public bool IsCCAllowed { get; set; }
        public string CCAllowed { get; set; }
        public bool IsExclude { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }

    [KnownType(typeof(AirlinePartTrans))]
    public class AirlinePartTrans
    {
        public int SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string HdnCitySNo { get; set; }
        public string CitySNo { get; set; }
        public bool IsPartAllowed { get; set; }
        public string PartAllowed { get; set; }
        public bool IsExclude { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
    }

    [KnownType(typeof(RecipientMessageTrnas))]
    public class RecipientMessageTrnas
    {
        public string MessageMovementType { get; set; }
        public string DestinationCountry { get; set; }
        public string DestinationCity { get; set; }
        public string MessageType { get; set; }
        public string MessageVersion { get; set; }
        public string Basis { get; set; }
        public string CutOffMins { get; set; }
    }
    /*-----------------Added By Pankaj Kumar Ishwar on 25/06/2018-----------------*/
    [KnownType(typeof(AirlineParameterInformation))]
    public class AirlineParameterInformation
    {
        public int SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string AirlineParameterText { get; set; }
        public string AirlineParameterValue { get; set; }
        public string Active { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public int ParameterType { get; set; }
        public int SeqNo { get; set; }
        public bool IsVisible { get; set; }
        public string Visible { get; set; }
        public string ParameterRemarks { get; set; }
        public string Insert { get; set; }
    }
    /*-----------------End-----------------*/
}
