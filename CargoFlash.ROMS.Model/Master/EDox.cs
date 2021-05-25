using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(EDox))]
    public class EDox
    {
        public int SNo { get; set; }

        public string DocumentName { get; set; }

        public int ApplicableIn { get; set; }

        public string Text_ApplicableIn { get; set; }

        public bool IsActive { get; set; }

        public string Active { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public string UpdatedBy { get; set; }
    }

    [KnownType(typeof(EDoxGrid))]
    public class EDoxGrid
    {
        public int SNo { get; set; }

        public string DocumentName { get; set; }

        public string ApplicableInTxt { get; set; }

        public string IsActiveTxt { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public string UpdatedBy { get; set; }
    }
}
