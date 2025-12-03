import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import { useGetUsers } from "../../hooks/user/useGetUsers"
import { useMemo, useState, useEffect } from "react";
import { useMonthlyBill } from "../../hooks/monthly-bills/useMonthlyBill";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../contexts/auth/AuthContext";
import { ToastContainer, Toast } from "react-bootstrap";
import { useGetAssignedUnits } from "../../hooks/assigned-unit/useGetAssignedUnits";

type FormType = {
    user_id: number | undefined,
    unit_id: number | undefined,
    amount_due: number | undefined,
    due_date: string,
    payment_status: string | undefined,
}

const initialFormState: FormType = {
    user_id: undefined,
    unit_id: undefined,
    amount_due: undefined,
    due_date: "",
    payment_status: undefined,
}

// Additional charges constants (same as in your backend)
const ADDITIONAL_CHARGES = {
    AMENITIES: 2500,
    SECURITY: 2000,
    MAINTENANCE: 1500
};

function EditBill({ id }: { id: string }) {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
    const [selectedUserName, setSelectedUserName] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUnitDetails, setSelectedUnitDetails] = useState<any>(null);
    const [calculatedAmount, setCalculatedAmount] = useState<number>(0);
    const [breakdown, setBreakdown] = useState({
        base_rent: 0,
        amenities: 0,
        security: 0,
        maintenance: 0,
        total: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    
    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'dark'>('danger');

    const filtersUsers = useMemo(() => {
        return {
            role: 'resident',
        }
    }, []);

    const { usersAsOptions } = useGetUsers(filtersUsers);
    const { units } = useGetAssignedUnits();
    const { viewMonthlyBill, updateMonthlyBill } = useMonthlyBill();
    const [formData, setFormData] = useState<FormType>(initialFormState);

    // Fetch bill data on component mount - ONLY once
    useEffect(() => {
         const fetchBillData = async () => {
        try {
            setIsLoading(true);
            const response = await viewMonthlyBill(id);
            
            if (response) {
                setFormData({
                    user_id: response.user.id,
                    unit_id: response.unit.id,
                    amount_due: Number(response.amount_due),
                    due_date: response.due_date ?? "",
                    payment_status: response.payment_status,
                });
                
                // Set selected user name
                const selectedUser = usersAsOptions?.find(user => user.id === response.user.id);
                if (selectedUser) {
                    setSelectedUserName(`${selectedUser.first_name} ${selectedUser.last_name}`);
                }
            }
        } catch (error) {
            console.log(error);
            setToastMessage("Failed to load bill data");
            setToastVariant('danger');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchBillData();;
    }, []); // Now depends on memoized fetchBill

    // Filter units based on selected user
    useEffect(() => {
        if (formData.user_id) {
            // Filter units where assigned_by.id matches the selected user_id
            const userUnits = units?.filter(unit => 
                unit.assigned_by.id === formData.user_id
            ) || [];
            
            // Transform the data to include unit details
            const transformedUnits = userUnits.map(unit => {
                // Convert rent_amount to number safely
                const rentAmount = typeof unit.unit_id.rent_amount === 'number' 
                    ? unit.unit_id.rent_amount
                    : typeof unit.unit_id.rent_amount === 'string'
                    ? parseFloat(unit.unit_id.rent_amount) || 0
                    : 0;
                
                return {
                    id: unit.unit_id.id,
                    assigned_unit_id: unit.id,
                    unit_name: unit.unit_id.unit_name,
                    building: unit.unit_id.building,
                    rent_amount: rentAmount,
                    amenities: unit.amenities,
                    security: unit.security,
                    maintenance: unit.maintenance,
                    full_name: `${unit.unit_id.unit_name} (${unit.unit_id.building})`
                };
            });
            
            setFilteredUnits(transformedUnits);
            
            // Find and set the selected unit details
            if (formData.unit_id) {
                const selectedUnit = transformedUnits.find(unit => unit.id === formData.unit_id);
                if (selectedUnit) {
                    setSelectedUnitDetails(selectedUnit);
                }
            }
        } else {
            setFilteredUnits([]);
            setSelectedUserName("");
        }
    }, [formData.user_id, formData.unit_id, units]);

    // Calculate amount when unit details change
    useEffect(() => {
        if (selectedUnitDetails) {
            calculateTotalAmount();
        }
    }, [selectedUnitDetails]);

    const calculateTotalAmount = () => {
        if (!selectedUnitDetails) return;

        const baseRent = selectedUnitDetails.rent_amount;
        let amenitiesCharge = 0;
        let securityCharge = 0;
        let maintenanceCharge = 0;

        // Calculate additional charges based on assigned unit settings
        if (selectedUnitDetails.amenities) {
            amenitiesCharge = ADDITIONAL_CHARGES.AMENITIES;
        }
        if (selectedUnitDetails.security) {
            securityCharge = ADDITIONAL_CHARGES.SECURITY;
        }
        if (selectedUnitDetails.maintenance) {
            maintenanceCharge = ADDITIONAL_CHARGES.MAINTENANCE;
        }

        const total = baseRent + amenitiesCharge + securityCharge + maintenanceCharge;

        setBreakdown({
            base_rent: baseRent,
            amenities: amenitiesCharge,
            security: securityCharge,
            maintenance: maintenanceCharge,
            total: total
        });

        setCalculatedAmount(total);
        
        // Only auto-fill if amount is not already set from the fetched bill
        if (!formData.amount_due || formData.amount_due === 0) {
            setFormData(prev => ({
                ...prev,
                amount_due: total
            }));
        }
    };

    const handleUnitSelection = (unit: any) => {
        setSelectedUnitDetails(unit);
        setFormData(prev => ({ 
            ...prev, 
            unit_id: unit.id 
        }));
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const unitId = e.target.value ? Number(e.target.value) : undefined;
        const selectedUnit = filteredUnits.find(unit => unit.id === unitId);
        
        if (selectedUnit) {
            handleUnitSelection(selectedUnit);
        } else {
            // Clear if no unit selected
            setFormData(prev => ({ 
                ...prev, 
                unit_id: undefined 
            }));
            setSelectedUnitDetails(null);
            setCalculatedAmount(0);
            setBreakdown({
                base_rent: 0,
                amenities: 0,
                security: 0,
                maintenance: 0,
                total: 0
            });
        }
    };

    const validateForm = () => {
        if (!formData.user_id || formData.user_id <= 0) {
            setToastMessage("Please select a resident");
            setToastVariant('danger');
            setShowToast(true);
            return false;
        }
        if (!formData.unit_id || formData.unit_id <= 0) {
            setToastMessage("Please select a unit");
            setToastVariant('danger');
            setShowToast(true);
            return false;
        }
        if (!formData.amount_due || formData.amount_due <= 0) {
            setToastMessage("Amount must be a positive number");
            setToastVariant('danger');
            setShowToast(true);
            return false;
        }
        if (!formData.due_date) {
            setToastMessage("Due date is required");
            setToastVariant('danger');
            setShowToast(true);
            return false;
        }
        if (!formData.payment_status) {
            setToastMessage("Please select payment status");
            setToastVariant('danger');
            setShowToast(true);
            return false;
        }

        return true;
    };

    const updateBill = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!validateForm()) {
                return;
            }
            
            setIsSubmitting(true);
            await updateMonthlyBill(id, formData);
            
            // Show success message
            setToastMessage("Bill updated successfully!");
            setToastVariant('success');
            setShowToast(true);

            // Wait a moment for the user to see the success message, then navigate
            setTimeout(() => {
                navigate({ to: `/${role}/monthly-bill` });
            }, 2000);
        } catch (error: any) {
            console.log(error);
            // Handle API errors
            const errorMessage = error.data?.non_field_errors?.[0] ||
                error.data?.detail ||
                "An error occurred while updating the bill";
            
            setToastMessage(errorMessage);
            setToastVariant('dark');
            setShowToast(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value ? Number(e.target.value) : undefined;
        setFormData(prev => ({
            ...prev,
            user_id: userId,
            unit_id: undefined // Reset unit when user changes
        }));
        setSelectedUnitDetails(null);
        setCalculatedAmount(0);
        setBreakdown({
            base_rent: 0,
            amenities: 0,
            security: 0,
            maintenance: 0,
            total: 0
        });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? Number(e.target.value) : undefined;
        setFormData(prev => ({
            ...prev,
            amount_due: value
        }));
    };

    if (isLoading) {
        return (
            <Container className="pt-5 d-flex flex-column w-100" style={{ maxWidth: "70rem" }}>
                <Header path={"admin"}>
                    <div className="d-flex gap-3">
                        <h3 className="fw-bold">Update Bill</h3>
                    </div>
                </Header>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading bill data...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container
            className="pt-5 d-flex flex-column w-100"
            style={{ maxWidth: "70rem" }}
        >
            {/* Toast Container */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={5000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === 'success' ? 'Success' : toastVariant === 'dark' ? 'Error' : 'Failed'}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className={toastVariant === 'success' ? 'text-white' : 'text-white'}>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Header component*/}
            <Header path={"admin"}>
                <div className="d-flex gap-3">
                    <h3 className="fw-bold">Update Bill</h3>
                </div>
            </Header>

            {/* Form page heading */}
            <div className="d-flex align-items-center gap-1 pt-5 mb-3">
                <span className="text-muted fw-bold d-flex align-items-center">
                    Monthly Bill
                </span>
                <FaAngleRight size={12} />
                <span className="text-dark fw-bold d-flex align-items-center">
                    Update Bill
                </span>
            </div>

            {/* Add Resident Form */}
            <Form
                onSubmit={updateBill}
                className="p-5 rounded-3 mb-5"
                style={{ backgroundColor: "#F2F2F7" }}
            >
                <h3>Details</h3>
                <Row className="pt-3">
                    {/* Resident Selection */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="formResident">
                            <Form.Label>Resident</Form.Label>
                            <Form.Select
                                value={formData.user_id || ''}
                                onChange={handleUserChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Select Resident</option>
                                {usersAsOptions?.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.middle_name} {user.last_name}
                                    </option>
                                ))}
                            </Form.Select>
                            {selectedUserName && (
                                <Form.Text className="text-muted">
                                    Showing assigned units for {selectedUserName}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>

                    {/* Units - Filtered based on selected resident */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="formUnit">
                            <Form.Label>Assigned Unit</Form.Label>
                            <Form.Select
                                value={formData.unit_id || ''}
                                onChange={handleUnitChange}
                                disabled={!formData.user_id || filteredUnits.length === 0 || isSubmitting}
                                required
                            >
                                <option value="">
                                    {!formData.user_id
                                        ? "Select a resident first"
                                        : filteredUnits.length === 0
                                            ? "No units assigned to this resident"
                                            : "Select unit"}
                                </option>
                                {filteredUnits?.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.unit_name} ({unit.building})
                                    </option>
                                ))}
                            </Form.Select>
                            {formData.user_id && filteredUnits.length === 0 && (
                                <Form.Text className="text-danger">
                                    This resident has no assigned units. Please assign a unit first.
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>

                    {/* Amount Due - Auto-calculated but editable */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="formAmountDue">
                            <Form.Label>Amount Due</Form.Label>
                            <Form.Control
                                value={formData.amount_due || ''}
                                onChange={handleAmountChange}
                                required
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="Auto-calculated amount"
                                disabled={isSubmitting}
                            />
                            {selectedUnitDetails && (
                                <Form.Text className="text-muted">
                                    Auto-calculated: ₱{calculatedAmount.toFixed(2)}
                                    {formData.amount_due !== calculatedAmount && (
                                        <span className="text-warning ms-2">
                                            (Modified from calculated amount)
                                        </span>
                                    )}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Col>

                    {/* Due Date */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="formDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                value={formData.due_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                                required
                                type="date"
                                disabled={isSubmitting}
                            />
                        </Form.Group>
                    </Col>

                    {/* Payment status */}
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="formPaymentStatus">
                            <Form.Label>Payment Status</Form.Label>
                            <Form.Select
                                value={formData.payment_status || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, payment_status: e.target.value }))}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Amount Breakdown (Visible when unit is selected) */}
                    {selectedUnitDetails && (
                        <Col xs={12}>
                            <div className="p-3 border rounded mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                                <h6 className="mb-2">Amount Breakdown</h6>
                                <Row>
                                    <Col xs={12} md={6}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Base Rent:</span>
                                            <span className="fw-medium">₱{breakdown.base_rent.toFixed(2)}</span>
                                        </div>
                                        {selectedUnitDetails.amenities && (
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Amenities Fee:</span>
                                                <span className="text-success">+ ₱{breakdown.amenities.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedUnitDetails.security && (
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Security Fee:</span>
                                                <span className="text-success">+ ₱{breakdown.security.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedUnitDetails.maintenance && (
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Maintenance Fee:</span>
                                                <span className="text-success">+ ₱{breakdown.maintenance.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="border-top pt-2 mt-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">Total:</span>
                                                <span className="fw-bold text-primary">₱{breakdown.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="mt-2 small text-muted">
                                    <div>Services included:</div>
                                    <div>
                                        {selectedUnitDetails.amenities && "✓ Amenities "}
                                        {selectedUnitDetails.security && "✓ Security "}
                                        {selectedUnitDetails.maintenance && "✓ Maintenance"}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )}

                    <Col xs={12} className="d-flex gap-3 flex-wrap align-items-center justify-content-end mt-3">
                        <div
                            onClick={() => navigate({ to: `/${role}/monthly-bill` })}
                            className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center px-5 py-3 rounded-3"
                            style={{ backgroundColor: "#CED4F5", cursor: "pointer" }}
                        >
                            <span className="text-black text-center fw-bold">Cancel</span>
                        </div>
                        <Button
                            type="submit"
                            title="Update Bill"
                            className="d-flex flex-grow-1 flex-sm-grow-0 align-items-center justify-content-center fw-bold border-0 px-3 py-3 rounded-3"
                            style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Bill'}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default EditBill