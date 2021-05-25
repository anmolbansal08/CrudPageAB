namespace WCF.Validation.Engine
{
    using System;
    using System.Collections.Generic;

    public abstract class ModelValidatorProvider
    {
        protected ModelValidatorProvider()
        {
        }

        public abstract IEnumerable<ModelValidator> GetValidators(ModelMetadata metadata);
    }
}

