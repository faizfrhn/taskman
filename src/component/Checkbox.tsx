import React from "react";

export interface ICheckboxProps {
    done: boolean;
    disabled: boolean;
    onChange: React.Dispatch<React.ChangeEvent<HTMLInputElement>>;
}

const Checkbox: React.FC<ICheckboxProps> = ({done, disabled, onChange}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        done = !done;
    };
    
    return (
        <input className="mx-2" type="checkbox" checked={done} disabled={disabled} onChange={handleChange} />
    )
}

export default Checkbox