using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.ULD
{

    [KnownType(typeof(SCMDiscrepancy))]
    public class SCMDiscrepancy
    {

        public int SNo { get; set; }
        public string Airport { get; set; }
        public DateTime? ScmDate { get; set; }
        public string ReqULDs { get; set; }
        public string ProULDs { get; set; }
        public string DisULDs { get; set; }
        public string AirlineName { get; set; }
        public string Remarks { get; set; }
        public string scmstatus { get; set; }
        public string currentinventory { get; set; }
        public string EDI_SCMSno { get; set; }
        public string IsClosedDiscrepancy { get; set; }


    }


}
