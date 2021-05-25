using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Stock
{
    [KnownType(typeof(StockAWB))]
    public class StockAWB
    {
        public Int32 SNo { get; set; }
        public string AWBType { get; set; }
        public int IsAutoAWB { get; set; }
        public String AutoAWB { get; set; }
        public String AWBPrefix { get; set; }
        public int AWBNumber { get; set; }
        public decimal AWBCheckDigit { get; set; }
        public String AWBNo { get; set; }
        public int CitySNo { get; set; }
        public String CityCode { get; set; }
        public int OfficeSNo { get; set; }
        public String OfficeName { get; set; }
        public Nullable<DateTime> OfficeIssueDate { get; set; }
        public int AccountSNo { get; set; }
        public String AccountName { get; set; }
        public string AccountIssueDate { get; set; }
        public int LotNo { get; set; }
        public Nullable<DateTime> ExpiryDate { get; set; }
        public int StockStatus { get; set; }
        public Boolean IsBlackListed { get; set; }
        public String BlackListed { get; set; }
        public String Remarks { get; set; }
        public Nullable<DateTime> ManufacturingYear { get; set; }
        public Boolean IsActive { get; set; }
        public String Active { get; set; }
        public String CreatedBy { get; set; }
        public String UpdatedBy { get; set; }
        public int TotalIssueStock { get; set; }
        public int TotalAgentIssueStock { get; set; }
        public int TotalStock { get; set; }
        public string Text_AWBPrefix { get; set; }
        //public string CreatedOn { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int CountryCode { get; set; }
        public String Text_CountryCode { get; set; }

    }
    public class AwbNo
    {
        //string strData, string AWBPrefix, int AWBType, int IsAutoAWB, int CountryCode, DateTime ExpiryDate
       
        //public string AWBPrefix { get; set; }
        //public int AWBType { get; set; }
        //public int IsAutoAWB { get; set; }
        //public int CountryCode { get; set; }
        //public string ExpiryDate { get; set; }
        public string AWBNo { get; set; } 
    }

    //public class AlradyCreatedStock
    //{
    //    public string AWBNo { get; set; }
    //}
    //public class LeftStock
    //{
    //    public string AWBNo { get; set; }
    //}
    //public class StockCollection
    //{
    //    public List<AlradyCreatedStock> alradyCreatedStock { get; set; }
    //    public List<LeftStock> leftStock { get; set; }
    //}

    //public class IssuedOfficeStock
    //{
    //    public string AWBNo { get; set; }
    //    public int CitySNo { get; set; }
    //    public String Text_City { get; set; }
    //    public int OfficeSNo { get; set; }
    //    public String Text_Office { get; set; }
    //    public int AccountSNo { get; set; }
    //    public String Text_Account { get; set; }
    //}
}
