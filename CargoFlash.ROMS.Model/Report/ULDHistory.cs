using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Report
{
    // Created By Swati Rastogi on 10 June,2016

    [KnownType(typeof(ULDHistory))]
    public class ULDHistory
    {
       public String StageSequence { get; set; }
       public String StageName { get; set; }
       public String  StageDate { get; set; }
       public String  GrossWeight { get; set; }
       public String  VolumeWeight { get; set; }
       public String  WaybillCount { get; set; }
       public String  FlightNo { get; set; }
       public String  FlightDate { get; set; }
       public String  UserID { get; set; }
       public String CityCode { get; set; }
       public String EventTime { get; set; }
       public String Dt { get; set; }
       public string uldSno { get; set; }

    }

    public class whereConditionULDHistory {
        public string FDate { get; set; }
        public string TDate { get; set; }
        public string ULD { get; set; }
    
    }

  
   
}
