
function paymentType(status: string) {

    switch(status) {
        case 'regular':
            return 'Monthly Payment';
        case 'advance':
            return 'Advance Payment';
        default:
            return status; // fallback
    }
}

export default paymentType