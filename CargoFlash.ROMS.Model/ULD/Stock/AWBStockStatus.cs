using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Stock
{
    [KnownType(typeof(AWBStockStatus))]
    public class AWBStockStatus
    {

        public string AWBPrefix { get; set; }
        public int OfficeSNo { get; set; }
        public string Name { get; set; }
        public int TotalStockIssued { get; set; }
        public int StockUnused { get; set; }
        public int StockIssuedToOffice { get; set; }
        public int StockIssuedToCity { get; set; }
        public int StockIssuedToAgent { get; set; }
        public int AccountSNo { get; set; }


        //TotalStock	UnusedStock	TotalStockIssueToOffice	TotalAgentIssueStock
        public int CitySNo { get; set; }
        public int StockBooked { get; set; }
        public int Void { get; set; }
        public int BlackListed { get; set; }
        public int UnusedStock { get; set; }


    }


    [KnownType(typeof(AWBStockStatusForExcel))]
    public class AWBStockStatusForExcel
    {
        public string AWBPrefix { get; set; }
        public string AWBNo { get; set; }
        public string AirlineName { get; set; }
        public string StockType { get; set; }
        public string AWBType { get; set; }
        public string OfficeName { get; set; }
        public string CityName { get; set; }
        public string AgentName { get; set; }
        //public int StockStatus { get; set; }
    }



     [KnownType(typeof(BlackLIstStock))]
    public class BlackLIstStock
    {
        public string AWBNo { get; set; }
        public string StockType { get; set; }
        public string AWBType { get; set; }
        public string CityName { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string Createddate { get; set; }
        public string IssueDate { get; set; }
        public string StockStatus { get; set; }


    }

     [KnownType(typeof(BlackLIstStockUpdate))]
     public class BlackLIstStockUpdate
     {
         public string AWBNo { get; set; }
         public string Remarks { get; set; }
     }


    public class ShortAdhocApproval
    {
        public int RASNo { get; set; }
        public string ApprovalStatus { get; set; }

        public decimal ApprovedAmount { get; set; }
    }




    [KnownType(typeof(BlackLIstStockReport))]
     public class BlackLIstStockReport
     {
         public string AWBNo { get; set; }
         public string StockType { get; set; }
         public string AWBType { get; set; }
         public string CityName { get; set; }
         public string OfficeName { get; set; }
         public string AgentName { get; set; }
         public string Createddate { get; set; }
         public string IssueDate { get; set; }
         public string StockStatus { get; set; }
         public string UpdatedBy { get; set; }
         public string Remarks { get; set; }

     }




     [KnownType(typeof(AWBStockHistoryReport))]
     public class AWBStockHistoryReport
     {
         public string Status { get; set; }
         public string AWBNo { get; set; }
         public string StockType { get; set; }
         public string AWBType { get; set; }
         public string CityName { get; set; }
         public string OfficeName { get; set; }
         public string AgentName { get; set; }
         public string Createddate { get; set; }
         public string IssueDate { get; set; }
        public string AWBStockStatus { get; set; }
        public string StockStatus { get; set; }
         public string UpdatedBy { get; set; }
         public string UpdatedOn { get; set; }
         	

     }

    

}
