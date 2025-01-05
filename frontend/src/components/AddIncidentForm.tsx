import React, { useState } from 'react';

interface AddIncidentFormProps {
    setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onIncidentAdded: () => void;
}

const AddIncidentForm: React.FC<AddIncidentFormProps> = ({ setIsFormOpen, onIncidentAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        latitude: '',
        longitude: '',
        alert: 'Low',
        magnitude: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/api/incidents/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    alert: formData.alert,
                    magnitude: formData.magnitude,
                    type: formData.type
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create incident');
            }

            const result = await response.json();
            console.log('Incident created:', result);
            //Close the form after successful submission
            setIsFormOpen(false);
            //Add the incident
            onIncidentAdded();
        } catch (error) {
            console.error('Error creating incident:', error);
        }
    };

    return (
        <>
            <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center p-4" style={{ zIndex: 1050 }}>
                <div className="bg-white rounded-3 shadow w-100" style={{ maxWidth: '600px' }}>
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-dark">
                        <h2 className="fs-4 fw-semibold text-white">Report New Incident</h2>
                        <button type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="btn-close btn-close-white" aria-label="Close">
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 mb-3">
                        <div>
                            <label className="d-block fs-6 fw-medium text-secondary mb-1">Title</label>
                            <input type="text" className="form-control w-100 rounded border"
                                value={formData.title}
                                name="title"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="d-block fs-6 fw-medium text-secondary mb-1">Description</label>
                            <textarea className="form-control w-100 rounded border" style={{ resize: 'none' }} rows={3} value={formData.description} name="description"
                                onChange={handleChange}></textarea>
                        </div>

                        <div className="row g-3">
                            <div className="col-6">
                                <label className="d-block fs-6 fw-medium text-secondary mb-1">Latitude</label>
                                <input type="number" className="form-control w-100 rounded border"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    min="-90"
                                    max="90"
                                    step="0.000000000000001"
                                    required />
                            </div>
                            <div className="col-6">
                                <label className="d-block fs-6 fw-medium text-secondary mb-1">Longitude</label>
                                <input type="number" className="form-control w-100 rounded border"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    min="-180"
                                    max="180"
                                    step="0.000000000000001"
                                    required />
                            </div>
                        </div>

                        <div>
                            <label className="d-block fs-6 fw-medium text-secondary mb-1">Magnitude</label>
                            <input type="text" className="form-control w-100 rounded border"
                                value={formData.magnitude}
                                name="magnitude"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="d-block fs-6 fw-medium text-secondary mb-1">Type</label>
                            <input type="text" className="form-control w-100 rounded border"
                                value={formData.type}
                                name="type"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="d-block fs-6 fw-medium text-secondary mb-1">Severity</label>
                            <select className="form-control w-100 rounded border"
                                name="alert"
                                value={formData.alert}
                                onChange={handleChange}
                                required>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-3">

                            <button
                                type="submit"
                                className="btn btn-primary">
                                Create Incident
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddIncidentForm;