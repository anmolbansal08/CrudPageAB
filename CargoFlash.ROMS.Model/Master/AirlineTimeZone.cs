using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Master
{
    /*
 *****************************************************************************
 Class Name:	AirlineTimeZone      
 Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                Implemenatation of class is perfomed in WEBUIs and Services 
 Company:		CargoFlash 
 Author:		Ajay Yadav
 
 *****************************************************************************
 */

    [KnownType(typeof(AirlineTimeZone))]
    public class AirlineTimeZone
    {
        /// <summary>
        /// SNo is the Primary  value in AirlineTimeZone Entity
        /// </summary>
        public int SNo { get; set; }
        public string TimeZoneName { get; set; }
        public int TimeDifference { get; set; }

        public string prefix { get; set; }

        public int Hour { get; set; }

        public int Minute { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
    }
}
