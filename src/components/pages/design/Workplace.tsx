"use client";
import React from 'react';

const Workplace: React.FC = () => {
    const handleCreateProject = () => {
    };

    return (
        <div>
            <header>
                <h1>Workplace</h1>
            </header>
            <button onClick={handleCreateProject}>Create New Project</button>
        </div>
    );
};

export default Workplace;