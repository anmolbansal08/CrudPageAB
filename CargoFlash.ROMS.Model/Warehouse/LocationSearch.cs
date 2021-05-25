// <copyright file=" LocationSearchModel.cs" company="Cargoflash">
//
// Created On: 02-Oct-2017
// Created By: DEVENDRA
// Description: Location Search Model for Warehouse location Search
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Warehouse
{
    #region Using Directive
    using System;
    using System.Runtime.Serialization;

    #endregion
    /// <summary>
    /// Location Search Model
    /// </summary>
    /// 
    public class LocationSearch
    {
        /// <summary>
        /// Gets or sets  WHSetup sno
        /// </summary>
        /// 
        public int? WHSetupSNo { get; set; }
        /// <summary>
        /// Gets or sets Terminal sno
        /// </summary>
        public int? TerminalSNo { get; set; }
        /// <summary>
        /// Gets or sets Airline sno
        /// </summary>
        public int? AirlineSNo { get; set; }
        /// <summary>
        /// Gets or sets  Airline sno
        /// </summary>
        public int? SPHCSNo { get; set; }
        /// <summary>
        /// Gets or sets ? SPHC No
        /// </summary>
        public int? DestinationCountrySNo { get; set; }
        /// <summary>
        /// Gets or sets DestinationCountry sno
        /// </summary>
        public int? DestinationCitySNo { get; set; }
        /// <summary>
        /// Gets or sets DestinationCity sno
        /// </summary>
        public int? AccountSno { get; set; }
        /// <summary>
        /// Gets or sets Account sno
        /// </summary>
        public int? WHTypeSNo { get; set; }
        /// <summary>
        /// Gets or sets WHType sno
        /// </summary>


        public string AWBNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ULDNo { get; set; }
        /// <summary>
        /// 
        /// </summary>

        public string ConsumablesName { get; set; }
        /// <summary>
        //
        /// </summary>
        /// 
        public string SearchBy { get; set; }
        public string LocationName { get; set; }

        public int? SearchText { get; set; }
        public int SearchAction { get; set; }
        public int? OriginCitySNo { get; set; }
        public int? DestAsLocation { get; set; }
        /// <summary>
        /// 
        /// </summary>

    }



}

