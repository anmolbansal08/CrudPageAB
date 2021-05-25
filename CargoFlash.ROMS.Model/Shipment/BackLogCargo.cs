using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Shipment
{
    #region Back Log Cargo Description
    /*
	*****************************************************************************
	Class Name:		Back Log Cargo   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Tarun Kumar
	Created On:		02 FEB 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion
    [KnownType(typeof(BackLogCargo))]
    public class BackLogCargo
    {
        public int SNo { get; set; }
        public String Airline { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public String Station { get; set; }
        public String FlightNo { get; set; }
        public String FlightDate { get; set; }
        //public Nullable<DateTime> FlightDate { get; set; }
        public String AWBNo { get; set; }
        public String Pieces { get; set; }
        public String TotalPc { get; set; }
        public String LyingPc { get; set; }
        public String GrossWeight { get; set; }
        public String VolumeWeight { get; set; }
        public String ULD { get; set; }
        public String OffloadSince { get; set; }
        public String Diffdays { get; set; }
        public String SHC { get; set; }
        public String Status { get; set; }
        public String OffloadFrom { get; set; }
        public String SLI { get; set; }
        public String NOG { get; set; }
    }

    public class deleteoffload
    {
   public string  username   { get; set; }
    public string  offsno      { get; set; }
    public string  AWbNo       { get; set; }
    public string  Remarks     { get; set; }
    public string  Pieces      { get; set; }
    public string  FlightNo    { get; set; }
    public string  FlightDate  { get; set; }
    public string  GrossWeight   { get; set; }
    }
}
