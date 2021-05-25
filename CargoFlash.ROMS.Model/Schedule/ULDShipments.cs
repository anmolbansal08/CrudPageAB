
// <copyright file="ULDShipments.cs" company="Cargoflash">
//
// Created On: 24-November-2017
// Created By: Braj
// Description: ULDShipments
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
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Runtime.Serialization;
    #endregion
    /// <summary>
    /// ULD Shipments used for assign uld and bulk shipment
    /// </summary>
    public class ULDShipments
    {
        /// <summary>
        /// Gets or sets uld stock sno or Bulk
        /// </summary>
        public string ULDStockSNo { get; set; }
        /// <summary>
        /// Gets or sets awbsno
        /// </summary>       
        public Int64 DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets off point there agent wants to move shipment
        /// </summary>
        public string AWBOffPoint { get; set; }

    }
}
