// <copyright file="AWBGrid.cs" company="Cargoflash">
//
// Created On: 8-Feb-2017
// Created By: Braj
// Description: AWB Grid
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>


namespace CargoFlash.Cargo.Model.SpaceControl
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    #endregion

    /// <summary>
    /// AWB Grid
    /// </summary>
    public class AWBGrid
    {
        /// <summary>
        /// Gets or sets awb sno
        /// </summary>
        public string AWBSNo { get; set; }
        /// <summary>
        /// Gets or sets allotment sno
        /// </summary>  
        public string AgentSNo { get; set; }
        /// <summary>
        /// Gets or sets daily flight sno
        /// </summary>
        public string DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets AWB no
        /// </summary>
        public string AWBNo { get; set; }
        /// <summary>
        /// Gets or sets origin airport code
        /// </summary>
        public string OriginAirportCode { get; set; }
        /// <summary>
        /// Gets or sets destination airport code
        /// </summary>
        public string DestinationAirportCode { get; set; }
        /// <summary>
        /// Gets or sets pieces
        /// </summary>
        public string Pieces { get; set; }
        /// <summary>
        /// Gets  or sets gross weight
        /// </summary>
        public decimal GrossWeight { get; set; }
        /// <summary>
        /// Gets or sets volume weight 
        /// </summary>
        public decimal VolumeWeight { get; set; }
        /// <summary>
        /// Gets or sets commodity 
        /// </summary>
        public string Commodity { get; set; }
        /// <summary>
        /// Gets or sets SHC
        /// </summary>
        public string SHC { get; set; }
        /// <summary>
        /// Gets or sets agent name 
        /// </summary>
        public string Agent { get; set; }
        /// <summary>
        /// Gets or sets priority name
        /// </summary>
        public string PriorityName { get; set; }
        /// <summary>
        /// Gets or sets remarks 
        /// </summary>
        public string Remarks { get; set; }
        /// <summary>
        /// Gets or sets yield 
        /// </summary>
        public decimal Yield { get; set; }
        /// <summary>
        /// Gets or sets revenue
        /// </summary>
        public string Revenue { get; set; }
        /// <summary>
        /// Gets or sets shipment status code
        /// </summary>
        public string ShipmentStatusCode { get; set; }
        /// <summary>
        /// Gets or sets on hold
        /// </summary>
        public string OnHold { get; set; }

    }

}
