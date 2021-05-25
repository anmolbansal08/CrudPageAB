using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDSLA))]
    public class ULDSLA
    {
       
        public int SNo { get; set; }
        public string CustomerSNo { get; set; }
       
        public string Text_CustomerSNo { get; set; }
        public string AgreementNumber { get; set; }
        public string EventSNo { get; set; }
        public string Text_EventSNo { get; set; }


        public string BasisSNo { get; set; }
        public string Text_BasisSNo { get; set; }

       
        public string MaintenanceTypeSNo { get; set; }

        public string Text_MaintenanceTypeSNo { get; set;}

        public string CutOffDay { get; set; }
        
      
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        public decimal ManHrsCost { get; set; }

        /// <For Grid Purpose>
        //Vendor,AgreementNumber,EventName,BasisName,MaintenanceTypeName,CutOffDay,ManHrsCost
        
        public string Vendor { get; set; }
        public string EventName { get; set; }
        public string BasisName { get; set; }
        public string MaintenanceTypeName { get; set; }
        

        /// </summary>
    }
}
