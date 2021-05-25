using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(SpecialHandlingCode))]
    public class SpecialHandlingCode
    {
        public int SNo { get; set; }
        public string Code { get; set; }
        public bool IsDGR { get; set; }
        public string Description { get; set; }
        public bool IsShownInNOTOC { get; set; }
        public bool IsExpress { get; set; }
        public bool IsHeavyWeightExempt { get; set; }
        public Nullable<Decimal> Priority { get; set; }
        public bool IsActive { get; set; }
        public bool IsTemperatureControlled { get; set; }
        public bool IsExpressDelivery { get; set; }
        public int DGClass { get; set; }
        public string Divisions { get; set; }
        public string SHCStatement { get; set; }
        public string MandatoryStatement { get; set; }
        public string StatementLabel { get; set; }
        public string PackingInstructionLabel { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string DGR { get; set; }
        public string ShownInNOTOC { get; set; }
        public string Express { get; set; }
        public string Active { get; set; }
        public string TemperatureControlled { get; set; }
        public string Detail { get; set; }
        public string Deleted { get; set; }
        public string HeavyWeightExempt { get; set; }
        public string ExpressDelivery { get; set; }
        public string Text_DGClass { get; set; }
        public string Text_Divisions { get; set; }
        public bool IsAllowLateAcceptance { get; set; }
        public string AllowLateAcceptance { get; set; }
    }
}
