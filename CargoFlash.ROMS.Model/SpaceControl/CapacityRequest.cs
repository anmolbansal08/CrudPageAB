// <copyright file="CapacityRequest.cs" company="Cargoflash">
//
// Created On: 8-March-2017
// Created By: Braj
// Description: Capacity Request Model
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
    /// Capacity Request model
    /// </summary>
    public class CapacityRequest
    {
        /// <summary>
        /// Gets or set Daily Flight SNo
        /// </summary>
        public int DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets Capacity type
        /// </summary>
        public string CapacityType { get; set; }

    }
}
