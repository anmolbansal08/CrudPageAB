using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;


namespace CargoFlash.Cargo.Model.Permissions
{
  
   [KnownType(typeof(WindowServicesReport))]
   public class WindowServicesReport
   {
       public int SNo { get; set; }
       public string ScheduleName { get; set; }
       public string StartAt { get; set; }
       public string EndAt { get; set; }
       public int IsRunning { get; set; }
       public string Exception { get; set; }
       public string Duration { get; set; }
       public string TimeDiff { get; set; }
       
       
   }

   [KnownType(typeof(WindowProcessStatus))]
   public class WindowProcessStatus
   {
       public int SNo { get; set; }
       public string ProcessName { get; set; }
       public string Remarks { get; set; }
       public string Process { get; set; }
      public string LastExecutionTime { get; set; }
      
   }



}
