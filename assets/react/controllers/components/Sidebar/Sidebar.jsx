import React from 'react';
import PropTypes from 'prop-types';
import SidebarCard from "./SidebarCard";

export default function Sidebar(props) {
    const {
        deaddrops
    } = props;

    return (
        <div className="bg-dd-dark-C space-y-4 rounded-xl relative h-screen-dvh px-4 py-6 overflow-y-scroll">
            {deaddrops.map((point, index) => (
                <SidebarCard
                    key={index}
                    deaddrop={point}
                />
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
