using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDRepairSLAReport))]
    public class ULDRepairSLAReport
    {
        public string ULDNo { get; set; }
        public string RepairRequest { get; set; }
        public string CostApproval { get; set; }
        public string MaintananceType { get; set; }
        public string Return { get; set; }
        public string Invoice { get; set; }
        public string CostApprovalSLA { get; set; }
        public string ReturnSLA { get; set; }
        public string InvoiceSLA { get; set; }

    }
}
