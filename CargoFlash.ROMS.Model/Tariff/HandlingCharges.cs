using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Tariff
{
    [KnownType(typeof(HandlingCharges))]
    public class HandlingCharges
    {
        public int SNo { get; set; }
        public int ParentSNo { get; set; }
        public string ChargeName { get; set; }
        public string PrimaryBasisOfChargeSNo { get; set; }
        public string SecondaryBasisOfChargeSNo { get; set; }
        public string Text_PrimaryBasisOfCharge { get; set; }
        public string Text_SecondaryBasisOfCharge { get; set; }
        public bool IsActive { get; set; }
        public string TariffDescription { get; set; }
        public string TariffAccountName { get; set; }
        public int TerminalSNo { get; set; }
        public string Country { get; set; }
        public string Text_Country { get; set; }
        public string City { get; set; }
        public string Text_City { get; set; }
        public string Active { get; set; }
        public string Ratetype { get; set; }
        public string Chargetype { get; set; }
        public string Text_Chargetype { get; set; }
        public bool ChargeCategory { get; set; }
        public string Text_ChargeCategory { get; set; }
        public bool IsRefundable { get; set; }
        public string Refundable { get; set; }
        public string InvoiceGroup { get; set; }
        public string Text_InvoiceGroup { get; set; }
    }

    [KnownType(typeof(HandlingChargesTrans))]
    public class HandlingChargesTrans
    {
        public int SNo { get; set; }
        public string ChargeName1 { get; set; }
        public bool IsActive1 { get; set; }
        public string Active1 { get; set; }
        public bool IsRefundable { get; set; }
        public string Refundable { get; set; }
    }
}
