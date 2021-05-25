using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Operation
{
    [DataContract]
    public class RCSData
    {
        [DataMember]
        public string AgentName { get; set; }
        [DataMember]
        public string TotalRCSCargo { get; set; }

        [DataMember]
        public string TotalRCSCargoNotBuild { get; set; }

        [DataMember]
        public string TotalOngoingBuild { get; set; }

        [DataMember]
        public string TotalRCSBuild { get; set; }

        [DataMember]
        public string TotalUWSNotDone { get; set; }

        [DataMember]
        public string TotalUWSDone { get; set; }

        [DataMember]
        public string TotalWaybillCount { get; set; }

        public string Agent { get; set; }
        public string RCSDate { get; set; }
        public string AWBDate { get; set; }
        public string AWBNo { get; set; }
        public string RCSCargo { get; set; }       
        public string RCSCargoNotBuild { get; set; }        
        public string OngoingBuild { get; set; }
        public string RCSBuild { get; set; }
        public string UWSNotDone { get; set; }
        public string UWSDone { get; set; }

        
        public String from { get; set; }
        
        public String to { get; set; }
        
        public String citycode { get; set; }
        
        public String Type { get; set; }

    }
   
}
