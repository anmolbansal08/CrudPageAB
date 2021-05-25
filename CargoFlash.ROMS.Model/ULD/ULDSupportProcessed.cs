using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDSupportProcessed))]
    public class ULDSupportProcessed
    {


        public int ULDSupportRequestAssignTransSNo { get; set; }
        public int ULDSupportRequestSno { get; set; }
        public string RequestRefNo { get; set; }
        public string RequestBy { get; set; }
        public string ULDType { get; set; }
        public string RequestQTY { get; set; }
        public string ProcessedQTY { get; set; }
        public string AssignedTo { get; set; }
        public string Remarks { get; set; }
        public int ULDSupportRequestQTY { get; set; }
        public string ClosedOn { get; set; }
        public string InitiateRemarks { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
    }
}
