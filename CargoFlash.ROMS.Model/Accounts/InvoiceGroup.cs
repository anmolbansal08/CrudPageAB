using System;
using System.Runtime.Serialization;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(InvoiceGroup))]
    public class InvoiceGroup
    {
        public int SNo { get; set; }
        public int Type { get; set; }
        public string Text_Type { get; set; }
        public int AccountSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string Validity { get; set; }
        public int CreatedBy { get; set; }
        public Boolean IsActive { get; set; }
        public string Active { get; set; }
        public List<InvoiceGroupTrans> InvoiceGroupTrans { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public int isUsed { get; set; }
        //public string RefNo { get; set; }
    }

    [KnownType(typeof(InvoiceGroupTrans))]
    public class InvoiceGroupTrans
    {
        public int SNo { get; set; }
        public string GroupName { get; set; }
        public string ChargeSNo { get; set; }
        public string Text_ChargeSNo { get; set; }
        //public string RefNo { get; set; }
    }

    [KnownType(typeof(InvoiceGroupGrid))]
    public class InvoiceGroupGrid
    {
        public int SNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public string Text_Type { get; set; }
        public Nullable<DateTime> Validity { get; set; }
        public string Active { get; set; }
       // public string RefNo { get; set; }
    }
}
