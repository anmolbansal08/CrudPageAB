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

    [KnownType(typeof(SPHCDocument))]
    public class SPHCDocument
    {
        public int SNo { get; set; }

        public string RefNo { get; set; }

        public string DocumentName { get; set; }
        public string Text_DocumentName { get; set; }


        public string DocumentCode { get; set; }



        public string AirportCode { get; set; }
        public string Text_AirportCode { get; set; }

        public string AirlineCode { get; set; }
        public string Text_AirlineCode { get; set; }

        public int SPHCType { get; set; }

        public string Text_SPHCType { get; set; }

        public string SPHC { get; set; }
        public string Text_SPHC { get; set; }

        public bool IsUploadMandatory { get; set; }

        public string Text_IsUploadMandatory { get; set; }

        public byte[] SampleDocument { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }

        public bool IsActive { get; set; }

        public string Active { get; set; }


        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
        public string DocumentMasterSPHCSampleSno { get; set; }

        public string SPHCSubGroupSNo { get; set; }
        public string Text_SPHCSubGroupSNo { get; set; }


    }
}
