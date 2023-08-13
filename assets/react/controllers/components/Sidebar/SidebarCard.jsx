import React from 'react';
import PropTypes from 'prop-types';

export default function SidebarCard(props) {
    const {
        deaddrop
    } = props;

    return (<div className="relative rounded-xl bg-dd-dark-A border-dd-dark-D group-hover:bg-dd-dark-D">
        <div className="p-4 space-y-2">
            <p className="text-white font-bold">{deaddrop.name}</p>
            <div className="text-xs uppercase font-black">
                <p className="text-gray-600">{deaddrop.size}</p>
                <p className="text-gray-500">{deaddrop.place}</p>
            </div>
        </div>
        <div
            className="absolute top-0 right-0 rounded-tr-full rounded-bl-full bg-dd-dark-D border-l border-b border-dd-dark-B px-3">
            <p className="text-gray-400 text-xs font-black">
                {deaddrop.createdAtReadable}
            </p>
        </div>
    </div>);
}


SidebarCard.propTypes = {
    deaddrop: PropTypes.object,
};

SidebarCard.defaultProps = {
    deaddrop: {},
};
