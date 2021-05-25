using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Irregularity
{

     [KnownType(typeof(IrregularityDisposalAdvice))]
   public class IrregularityDisposalAdvice
    {
        public int SNo { get; set; }
        public string DisposalAdvice { get; set; }
        public bool IsActive { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedOn { get; set; }
      
        public string Active { get; set; }
    }
}
