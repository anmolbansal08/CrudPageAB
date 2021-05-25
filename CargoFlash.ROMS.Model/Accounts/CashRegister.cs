using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
     [KnownType(typeof(CashRegister))]
    public class CashRegister
    {
        public string CashierID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime Todate { get; set; }
        public string ForwardedAmount { get; set; }
        public string ParentID { get; set; }

    
    }
     public class CashRegisterdetail
     {
         public string SNo { get; set; }
         public string CashRegisterSno { get; set; }
         public string Remarks { get; set; }
         public string ServerUTC { get; set; }
         public string ServerLocal { get; set; }
         public string ServerTimeZone { get; set; }
         public string CashierName { get; set; }
         public string Date { get; set; }
         public string TransferTime { get; set; }
         public string Currency { get; set; }
         public string AmountDeposited { get; set; }
         public string TotalCashReceivedAmount { get; set; }
         public string TotalReceiveAmount { get; set; }
         public string CashRefund { get; set; }
         public string Status { get; set; }
        public string AWBNo { get; set; }
        public string InvoiceNo { get; set; }
         public string TYPE { get; set; }
     }
    [KnownType(typeof(AmountDeposit))]
    public class AmountDeposit
    {
        public string SNo { get; set; }
        public string CashRegisterSno { get; set; }
        public string HdnDepositedToUserId { get; set; }
        public string DepositedAmount { get; set; }
        public string AccountNo { get; set; }
        public string DepositType { get; set; }
        public string Status { get; set; }
        public string RefNo { get; set; }
        public string DRemark { get; set; }
        public string StartShift { get; set; }
    }
     [KnownType(typeof(ReceiveAmount))]
    public class ReceiveAmount    {

        public string CashRegisterSNo { get; set; }
        public string Amount { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
    }
}
