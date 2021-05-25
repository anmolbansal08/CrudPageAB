using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(TransactionHistory))]
    public class TransactionHistory
    {
        public Int32 SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public int AccountSNo { get; set; }
        public string AgentName { get; set; }
        public string AgentCode { get; set; }
        public int CitySNo { get; set; }
        public string Text_CitySNo { get; set; }
        public int OfficeSNo { get; set; }
        public string Text_OfficeSNo { get; set; }
        public int CurrencySNo { get; set; }
        public string Text_CurrencySNo { get; set; }
        public double Amount { get; set; }
        public int TransactionType { get; set; }
        public string Text_TransactionType { get; set; }
        public string TransactionDate {  get; set; }
        public string AccountNo { get; set; }
    }


    public class TransactionHistoryRequest
    {
        public int AirlineSNo { get; set; }
        public int CitySNo { get; set; }
        public int OfficeSNo { get; set; }
        public int AccountSNo { get; set; }

    }
}
