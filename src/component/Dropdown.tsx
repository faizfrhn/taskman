import React from 'react';
import Form from 'react-bootstrap/Form';

export interface IOptions {
    label: string;
    value: string;
}

export interface IDropdownProps {
    label: string;
    value: string;
    options: IOptions[],
    onChange: React.Dispatch<React.ChangeEvent<HTMLSelectElement>>
}

const Dropdown: React.FC<IDropdownProps> = ({ label, value, options, onChange }) => {

    return (
        <Form.Select aria-label={label} value={value} onChange={onChange}>
            {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </Form.Select>
    );
};

export default Dropdown