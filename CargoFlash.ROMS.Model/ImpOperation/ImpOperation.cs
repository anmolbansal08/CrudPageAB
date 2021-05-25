using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.ImpOperation
{
    [DataContract]
    public class Data
    {
        
        public string Airline { get; set; }
        

        public string TonnageRecd { get; set; }

        
        public string TonnageArrived { get; set; }

        public string Pending { get; set; }

       
        public string Ongoing { get; set; }

       
        public string Completed { get; set; }

      
        public string Location { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FFMDate { get; set; }

        [DataMember]
        public string AirlineName { get; set; }

        [DataMember]
        public string TotalTonnageRecd { get; set; }

        [DataMember]
        public string TotalTonnageArrived { get; set; }

        [DataMember]
        public string TotalPending { get; set; }

        [DataMember]
        public string TotalOngoing { get; set; }

        [DataMember]
        public string TotalCompleted { get; set; }

        [DataMember]
        public string TotalLocation { get; set; }

        
        public String from { get; set; }
        
        public String to { get; set; }
        
        public String citycode { get; set; }
        
        public String Type { get; set; }



        public string TTonnageRecd { get; set; }
        public string TTonnageArrived { get; set; }
        public string TPending { get; set; }
        public string TCompleted { get; set; }
        public string TOngoing { get; set; }
        public string TLocation { get; set; }
    }
    

}
