// <copyright file="AWBGridRequest.cs" company="Cargoflash">
//
// Created On: 06-Feb-2017
// Created By: Braj
// Description: AWB Grid Request
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
    /// AWB grid request 
    /// </summary>
    public class AWBGridRequest
    {
        /// <summary>
        /// Gets or sets daily flight sno with comma separated or single
        /// </summary>
        public string DailyFlightSNo { get; set; }
        /// <summary>
        /// Gets or sets awb reference booking sno
        /// </summary>
        public string AWBRefSNo { get; set; }
        /// <summary>
        /// Gets or sets awb no 
        /// </summary>        
        public string AWBNo { get; set; }
        public string SearchBy { get; set; }

        /// <summary>
        /// Gets or sets product sno where we can search shipment based on product type 
        /// </summary>
        public int ProductSNo { get; set; }
        /// <summary>
        /// Gets or sets booking type that is Reservation, PO Mail, Offloaded
        /// </summary>
        public string BookedFrom { get; set; }
    }


}
