using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    #region AirCraft Description
    /*
	*****************************************************************************
	Class Name:		AircraftDimensionMatrix   
	Purpose:		This class used to handle
	Company:		CargoFlash Infotech Pvt Ltd.
	Author:			Laxmikanta Pradhan
	Created On:		02 Jan 2016
    Updated By:    
	Updated On:
	Approved By:    
	Approved On:	
	*****************************************************************************
	*/
    #endregion

    [KnownType(typeof(AircraftDimensionMatrixGridData))]
    public class AircraftDimensionMatrixGridData
    {
        #region Public Properties
        public int SNo { get; set; }
        public string Aircraft { get; set; }
        public string HoldType { get; set; }
        public string Unit { get; set; }
        public int Rows { get; set; }
        public int Columns { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        //public Nullable<DateTime> UpdatedOn { get; set; }
        //public Nullable<DateTime> CreatedOn { get; set; }
        #endregion
    }

    [KnownType(typeof(AircraftDimensionMatrix))]
    public class AircraftDimensionMatrix
    {
        #region Public Properties
           //public int SNo { get; set; }
            public int AircraftSNo { get; set; }
            public int HoldType { get; set; }
            public string Unit { get; set; }
            public int Rows { get; set; }
            public int Cols { get; set; }
            public string CreatedBy { get; set; }
            public string UpdatedBy { get; set; }   
            //public Nullable<DateTime> UpdatedOn { get; set; }
            //public Nullable<DateTime> CreatedOn { get; set; }
        #endregion
    }

    [KnownType(typeof(AircraftMatrixTrans))]
    public class AircraftMatrixTrans
    {
        //public int ADRowNo { get; set; }
        //public int ADColNo { get; set; }
        //public int CellValue { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        //public string UpdatedBy { get; set; }   
    }

    [KnownType(typeof(AircraftMatrixTransVal))]
    public class AircraftMatrixTransVal
    {
        public int ADRowNo { get; set; }
        public int ADColNo { get; set; }
        public int CellValue { get; set; }
        //public int lngth { get; set; }
        //public int wdth { get; set; }
        //public int hgt { get; set; }
    }

    [KnownType(typeof(AircraftMatrixMasterTrans))]
    public class AircraftMatrixMasterTrans
    {
        #region Public Properties
        public List<AircraftDimensionMatrix> aircraftDimensionMatrix { get; set; }
        //public List<AircraftMatrixTrans> aircraftMatrixTrans { get; set; }
        public List<AircraftMatrixTransVal> aircraftMatrixTransVal { get; set; }
        #endregion
    }

    [KnownType(typeof(AircraftMatrixRead))]
    public class AircraftMatrixRead
    {
        public int SNo { get; set; }
        public string Aircraft { get; set; }
        public string HoldType { get; set; }
        public string Unit { get; set; }
        public int Rows { get; set; }
        public int Cols { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int ADRowNo { get; set; }
        public int ADColNo { get; set; }
        public int CellValue { get; set; }
    }
}
