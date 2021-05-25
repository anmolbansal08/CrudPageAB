using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
namespace CargoFlash.Cargo.Model.Master
{
     [KnownType(typeof(WeighingScale))]
   public  class WeighingScale
    {
         public int SNo { get; set; }

         public string Name { get; set; }

         public string WeighingScaleID { get; set; }

         public int CitySNo { get; set; }
         public string Text_CitySNo { get; set; }
         
         public int AirportSNo { get; set; }
         public string Text_AirportSNo { get; set; }    

         public int TerminalSNo{ get; set; }
         public string Text_TerminalSNo { get; set; }

                 
         public string IPAddress { get; set; }


         public string FTPHostName { get; set; }
         public string FTPFolderPath { get; set; }

         public string FTPUserId { get; set; }

         public string FTPPassword { get; set; }

         public bool IsActive { get; set; }

         public string Active { get; set; }
         public string CityName { get; set; }
         public string AirportName { get; set; }

         public string TerminalName { get; set; }
         public String PortNo { get; set; }
         public string CreatedBy { get; set; }
        // public DateTime CreatedOn { get; set; }

         public string UpdatedBy { get; set; }

      

        // public DateTime UpdatedOn { get; set; }
        
     }
}
