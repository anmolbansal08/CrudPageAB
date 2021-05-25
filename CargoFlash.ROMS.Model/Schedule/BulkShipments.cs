
// <copyright file="BulkShipments.cs" company="Cargoflash">
//
// Created On: 24-November-2017
// Created By: Braj
// Description: BulkShipments
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//

namespace CargoFlash.Cargo.Model.Schedule
{

    #region Using Directive
    using System;   
    #endregion

    /// <summary>
    /// Bulk shipment 
    /// </summary>
    public class BulkShipments
    {
        /// <summary>
        /// Gets or sets uld stock sno or Bulk
        /// </summary>
        public string ULDStockSNo { get; set; }
        /// <summary>
        /// Gets or sets awbsno
        /// </summary>
        public int? AWBSNo { get; set; }
        /// <summary>
        /// Gets or sets daily flight sno
        /// </summary>
        public Int64? DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets off point daily flight sno
        /// </summary>
        public Int64? OffPointDailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets off point there agent wants to move shipment
        /// </summary>
        public string AWBOffPoint { get; set; }
        /// <summary>
        /// Gets or sets IsStop over shipment status
        /// </summary>
        public bool IsStopOver { get; set; }
    }
}
