using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;
namespace CargoFlash.Cargo.Model.Shipment
{
   


    [KnownType(typeof(ReturntoShipperGridData))]
    public class ReturntoShipperGridData
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string TotalCharges { get; set; } 

         public string Origin { get; set; }
         public string Destination { get; set; }
        public string ReturnDate { get; set; }



        #endregion
    }


    [KnownType(typeof(SaveReturnShipment))]
    public class SaveReturnShipment
    {
        #region Public Properties
        public Int32 SNo { get; set; }
        public string AWBSNo { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string VolumeWeight { get; set; }
        public string Volume { get; set; }
        public string CustomRefNo { get; set; }
        public string NOCRefNo { get; set; }
        public string Reason { get; set; }
        public string TotalCharges { get; set; }
        

        #endregion
    }
}
