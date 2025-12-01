import { createFileRoute } from '@tanstack/react-router'
import PaymentRecordsTable from '../../../../../components/admin/tables/PaymentRecordsTable'
import { usePayments } from '../../../../../hooks/payments/usePayments'
import { useFiltersContext } from '../../../../../contexts/FilterContext';

export const Route = createFileRoute('/_protected/admin/financial/_financial/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { filters } = useFiltersContext()
  const {payments, prevButton, nextButton, pageNumber, updatePayment, deletePayment} = usePayments(filters);

   const handleUpdatePayment = (id: number, newStatus: string) => {
    updatePayment(id.toString(), {status: newStatus});
  };

   // ✅ callback for deleting a payment
  const handleDeletePayment = (id: number) => {
    deletePayment(id.toString());
    return
    // setPaymentList(prev => prev.filter(payment => payment.id !== id));
  };

  return <PaymentRecordsTable onUpdate={handleUpdatePayment} onDelete={handleDeletePayment} payments={payments} prevButton={prevButton} nextButton={nextButton} pageNumber={pageNumber}/>
}
