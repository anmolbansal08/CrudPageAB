using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
   public class GenerateAndViewInvoice
    {
        public string AirlineName { get; set; }
        public string AirlineAddress { get; set; }
        public string GSA_CSA_AirlineName { get; set; }
        public string GSA_CSA_Address { get; set; }
        public string GSA_CSA_Country { get; set; }
        public string Attention { get; set; }
        public string InvoiceCurrency { get; set; }
        public string InvoiceDate { get; set; }
        public string InvoiceDueDate { get; set; }
        public string InvoiceARCode { get; set; }
        public string InvoicePeriod { get; set; }
        public string InvoiceNo { get; set; }
        public string Remarks { get; set; }
        public string AccountName { get; set; }
        public string AccountNo { get; set; }
        public string BankName { get; set; }
        public string BankAddress { get; set; }
        public string IBAN { get; set; }
        public string Swift { get; set; }
        public decimal TotalAmlount { get; set; }
        public string AirlineLogo { get; set; }
        public int SNo { get; set; }
        public int InvoiceDays { get; set; }
        public int ExchangeRate { get; set; }
        public int Quantity { get; set; }
        public int Discount { get; set; }
        public int UnitPrice { get; set; }
        public int TotalValue { get; set; }
        public string IsInvoiceType { get; set; }
        public string CompanyName { get; set; }
       // public string Commodity { get; set; }
        public string ConvertedCurrency { get; set; }
    }
    public class SendMailDetails
    {
        public int InvoiceSNo { get; set; }
        public bool IsChecked { get; set; }
        public string GSA_CSA_AirlineName { get; set; }
        public string EmailID { get; set; }
        public string InvoiceNo { get; set; }
        public string MailSubject { get; set; }
    }
    public class SaveMailDetails
    {
        public int InvoiceSNo { get; set; }
        public string EmailID { get; set; }
        public string OfficeSNo { get; set; }
        public string MailSubject { get; set; }
        public string MailBody { get; set; }
        public int CreatedBy { get; set; }
    }
}
