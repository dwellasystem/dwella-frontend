import React, { useEffect } from 'react'
import PaymentMethodService from '../../services/paymentMethod.service'
import type { IServiceError } from '../../interfaces/error-handlers/IServiceError';
import type { PaymentMethod } from '../../models/PaymentMethod.model';

export const usePaymentMethods = () => {
  const {getPaymentMethods} = PaymentMethodService();

  const [methods, setMethods] = React.useState<PaymentMethod[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
     const fetchPaymentMethods = async () => {
        try {
            const response = await getPaymentMethods();
            setMethods(response.data)
        } 
        catch (error) {
            const err = error as IServiceError
            if(err.status !== 200) setError('Server Error')
        }
        finally{
            setLoading(false)
        }
    }
    fetchPaymentMethods();
  }, []);

    return {methods, loading, error};
}