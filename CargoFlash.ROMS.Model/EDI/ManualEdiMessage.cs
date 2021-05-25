using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.EDI
{
  public  class ManualEdiMessage
    {
     
      public string MsgType { get; set; }
      public string MsgSubType { get; set; }
      public string TxtVersion { get; set; }
      public string Email { get; set; }
      public string SitaId { get; set; }
      public string Message { get; set; }
    
      
      
    }
}
