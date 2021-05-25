using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(RegistryControl))]
    public class RegistryControl
    {
        
        public Int32 SNo { get; set; }
        public string processName { get; set; }
        public string SubProcessName { get; set; }
        public string pagename { get; set; }
        public string priority { get; set; }
        public string ProcessName { get; set; }
        public string IsRequired { get; set; }

        public string Text_ProcessSNo { get; set; }
        public Int32 ProcessSNo { get; set; }

        public Int32 CitySNo { get; set; }
        public string Text_CitySNo { get; set; }

        public Int32 GroupSNo { get; set; }
        public string Text_GroupSNo { get; set; }

        public Int32 AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }

        public Int32 PageSNo { get; set; }
        public string Text_PageSNo { get; set; }

        public string RType { get; set; }


        public string isdisplay { get; set; }
        public string isactive { get; set; }
        public string isdeleted { get; set; }
        public string isoneclick { get; set; }
        public string displaycaption { get; set; }
        public string progresscheck { get; set; }
        public string ispopupsubprocess { get; set; }
    }

    [KnownType(typeof(RCGridTran))]
    public class RCGridTran
    {
        public string AirlineSNo {get; set;}
        public string CitySNo {get; set;}
        public string GroupSNo {get; set;}
        public string ProcessSNo { get; set; }
        public string PageSNo {get; set;}
        public string Text_AirlineSNo {get; set;}
        public string Text_CitySNo {get; set;}
        public string Text_GroupSNo {get; set;}
        public string Text_ProcessSNo {get; set;}
        public string Text_PageSNo {get; set;}
        public Int32 SPSNo { get; set; }
        public Int32 PSNo { get; set; }
        public string SPName { get; set; }
        public string priority { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDisplay { get; set; }
        public bool IsActive { get; set; }
        public bool IsOnClick { get; set; }
      
        public string DC { get; set; }
        public bool ProgressCheck { get; set; }
        public bool IsPopUpSubProcess { get; set; }
        public string Status { get; set; }
        public string Group { get; set; }
        public string totRowCount { get; set; }
     
       
    }

    [KnownType(typeof(RCGridTran1))]
    public class RCGridTran1
    {
        public Int32 SPTSNo { get; set; }
        public Int32 SPSNo { get; set; }
        public string RCPriority { get; set; }
        public string priority { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDisplay { get; set; }
        public bool IsActive { get; set; }
        public bool IsOnClick { get; set; }
      
        public string HdnSPSNo { get; set; }
        public bool ProgressCheck { get; set; }
        public string DisplayCaption { get; set; }


    }
}
