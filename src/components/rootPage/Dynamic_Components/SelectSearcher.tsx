import React, { useState } from 'react';
import './styles/SelectSearcher.css'

type CustomSelectProps = {
    options: any[];
};

const SelectSearcher: React.FC<CustomSelectProps> = ({ options }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredOptions = options.filter(option =>
        option.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectOption = (option: any) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="custom-select">
            <input
                type="text"
                value={searchTerm}
                placeholder={selectedOption || 'Select an option'}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isDropdownOpen && (
                <ul className="options-list">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li key={index} onClick={() => handleSelectOption(option)}>
                                {option}
                            </li>
                        ))
                    ) : (
                        <li>No options found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SelectSearcher;
