// <copyright file="AdviceStatusCodeRequest.cs" company="Cargoflash">
//
// Created On: 31-March-2017
// Created By: Braj
// Description: Advice Status Code Request
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
    /// Advice Status Code Request
    /// </summary>
    public class AdviceStatusCodeRequest
    {
        /// <summary>
        /// gets or sets awb sno
        /// </summary>
        public int AWBSNo { get; set; }
        /// <summary>
        /// Gets or sets awb reference booking sno
        /// </summary>
        public int AWBRefBookingSNo { get; set; }
        /// <summary>
        /// gets or sets daily flight sno
        /// </summary>
        public int DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets flight plan sno
        /// </summary>
        public int FlightPlanSNo { get; set; }
        /// <summary>
        /// Gets or sets advice status code
        /// </summary>
        public string AdviceStatusCode { get; set; }
        
        /// <summary>
        /// Gets or sets awb status
        /// </summary>
        public string AWBStatus { get; set; }
        /// <summary>
        /// Gets or sets booking type that is Reservation, Po Mail, Offloaded cargo shipment
        /// </summary>
        public string BookedFrom { get; set; }
    }
}
