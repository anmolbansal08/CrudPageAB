using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
/*
*****************************************************************************
    Class Name:		Document Master      
    Purpose:		Used for DocumentMaster
    Company:		CargoFlash 
    Author:			Karan Kumar
    Created On:		27 Jan 2016

    *****************************************************************************

*/

namespace CargoFlash.Cargo.Model.Master
{
   
    [KnownType(typeof(DocumentMaster))]
    public class DocumentMaster
    {
        public int SNo { get; set; }

        //public int ZoneSNo { get; set; }

        public string DocumentName { get; set; }

        //public string Text_ZoneSNo { get; set; }

        public string Description { get; set; }

      

        public bool IsActive { get; set; }

        public string Active { get; set; }

      
        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }

    }
}
