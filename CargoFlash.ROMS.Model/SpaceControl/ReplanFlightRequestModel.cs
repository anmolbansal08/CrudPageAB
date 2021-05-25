// <copyright file="ReplanFlightRequestModel.cs" company="Cargoflash">
//
// Created On: 8-March-2017
// Created By: Braj
// Description: Replan Flight Request Model
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
    /// Replan Flight Request Model
    /// </summary>
    public class ReplanFlightRequestModel
    {
        /// <summary>
        /// Gets or sets awb reference booking sno
        /// </summary>
        public int? AWBRefBookingSNo { get; set; }
        /// <summary>
        /// Gets or sets Daily flight SNo
        /// </summary>
        public int? DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets booked from that is module type
        /// </summary>
        public string BookedFrom { get; set; }

        /// <summary>
        /// Gets or sets airport sno
        /// </summary>
        public int? AirportSNo { get; set; }
        /// <summary>
        /// Gets or sets account sno
        /// </summary>
        public int? ACSNo { get; set; }


    }
}
