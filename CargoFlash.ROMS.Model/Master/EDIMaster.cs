using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
/*
*****************************************************************************
    Class Name:		EDIMaster      
    Purpose:		Used to Traverse Structured data from Sql Server to WebPage and vice versa
                    Implemenatation of class is perfomed in WEBUIs and Services 
    Company:		CargoFlash 
    Author:			Ajay Yadav
    Created On:		06 March 2014

    *****************************************************************************

*/
namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(EDIMaster))]
    public class EDIMaster
    {
        public int SNo { get; set; }      


        public string Name { get; set; }

        public string Age { get; set; }

        public string City { get; set; }
        public string Text_City { get; set; }



    }
}
