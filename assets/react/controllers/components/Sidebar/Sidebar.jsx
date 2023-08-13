import React from 'react';
import PropTypes from 'prop-types';
import SidebarCard from "./SidebarCard";

export default function Sidebar(props) {
    const {
        deaddrops, onMarkerSelect
    } = props;

    return (
        <div className="bg-dd-dark-C space-y-4 rounded-xl relative h-screen-dvh px-4 py-6 overflow-y-scroll">
            {deaddrops.map((deaddrop, index) => (
                <a
                    className="block group"
                    key={index}
                    onClick={() => onMarkerSelect(deaddrop)}
                >
                    <SidebarCard
                        deaddrop={deaddrop}
                    />
                </a>
            ))}
        </div>
    );
}

Sidebar.propTypes = {
    deaddrops: PropTypes.array,
};

Sidebar.defaultProps = {
    deaddrops: [],
};
