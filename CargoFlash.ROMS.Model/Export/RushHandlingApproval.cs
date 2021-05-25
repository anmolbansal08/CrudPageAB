using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model
{
    
        [KnownType(typeof(RushHandlindlingApprovalGridData))]
        public class RushHandlindlingApprovalGridData
        {
            #region Public Properties
            public int SNo { get; set; }
            public string AWBNo { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }
            public string ApproveStatus { get; set;}
            public int Pieces { get; set; }
            public decimal Grossweight { get; set; }
            public decimal Chargeableweight { get; set; }
            public string Requestedby { get; set; }
            public string Approvedby { get; set; }
       
      
        #endregion
    }

    [KnownType(typeof(SaveRushHandlingApproval))]
        public class SaveRushHandlingApproval
        {
            public string AWBSNo { get; set; }
            public string AWBNo { get; set; }
            public string Origin { get; set; }
            public string Destination { get; set; }          
            public string Account { get; set; }
            public string Pieces { get; set; }
            public string GrossWeight { get; set; }
            public string VolumeWeight { get; set; }           
            public string FlightNo { get; set; }
            public string FlightDate { get; set; }
            public string ApproveStatus { get; set; }
            public string Remarks { get; set; }
            //public string CCANo { get; set; }

        }

}
