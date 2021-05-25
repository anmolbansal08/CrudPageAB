using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region SLA Description
    /*
	*****************************************************************************
	Class Name:		SLA   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		25 Jan 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(SLA))]
    public class SLA
    {
        public int SNo { get; set; }
        public string SLAType { get; set; }
        public string SLATypeTxt { get; set; }
        public int AirportSNo { get; set; }
        public string Text_AirportSNo { get; set; }
        public int TerminalSNo { get; set; }
        public string Text_TerminalSNo { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string StandardName { get; set; }
        public string MovementType { get; set; }
        public string Text_MovementType { get; set; }
        public string Basis { get; set; }
        public string BasisTxt { get; set; }
        public int EventSNo { get; set; }
        public string Text_EventSNo { get; set; }
        public int DisplayOrder { get; set; }
        public int MinimumCutOffMins { get; set; }
        public string AircraftSNo { get; set; }
        public string Text_AircraftSNo { get; set; }
        public string SHCSNo { get; set; }
        public string Text_SHCSNo { get; set; }
        public string TargetPercentage { get; set; }
        public string UpdatedBy { get; set; }
        public string CreatedBy { get; set; }
        public string MessageType { get; set; }
        public string Text_MessageType { get; set; }

        public string SLAAirlineSno { get; set; }
        public string Text_SLAAirlineSno { get; set; }


        public int MessageTypeSNo { get; set; }
        public string Text_MessageTypeSNo { get; set; }


    }
    [KnownType(typeof(SLATrans))]
    public class SLATrans
    {
        public int SNo { get; set; }
        public int SLASNo { get; set; }
        public string SlabName { get; set; }
        public string HdnAircraftBodyType { get; set; }
        public string AircraftBodyType { get; set; }      
        public string Type { get; set; }
        public string StartWeight { get; set; }
        public string EndWeight { get; set; }
        public string StartPercentage { get; set; }
        public string EndPercentage { get; set; }
        public string CutOffMins { get; set; }
        public string UpdatedBy { get; set; }
        public string TypeTxt { get; set; }
    }
    [KnownType(typeof(SLAMasterInfo))]
    public class SLAMasterInfo
    {
        #region Public Properties
        public List<SLA> SLA { get; set; }
        public List<SLATrans> SLATrans { get; set; }
        #endregion
    }
}
