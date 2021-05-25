using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    /*
*****************************************************************************
Class Name:	  Zone      
Purpose:	  Used Traverse Structured data to Sql Server to WebPage and vice versa
              Implemenatation of class is perfomed in WEBUIs and Services 
Company:	  CargoFlash 
Author:		  Ajay Yadav
 
*****************************************************************************
*/
    [KnownType(typeof(Zone))]
    public class Zone
    {
        public int SNo { get; set; }
        public string ZoneName { get; set; }

        public bool IsActive { get; set; }
        public String Active { get; set; }

        public string CreatedBy { get; set; } 

        public string UpdatedBy { get; set; }

        /// properties Have been added to ADD Zone Trans Details Added By Vsingh Task-57 on 12/01/2017
        public int ZoneBasedOn { get; set; }
        public string Text_ZoneBasedOn { get; set; }
        public string ZoneBasedOnSNo { get; set; }
        public string Text_ZoneBasedOnSNo { get; set; }
        /// properties Have been added to ADD Zone Trans Details Added By Vsingh Task-57 on 12/01/2017
    }
}
