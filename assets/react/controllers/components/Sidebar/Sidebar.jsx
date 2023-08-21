import React from 'react';
import PropTypes from 'prop-types';
import SidebarCard from "./SidebarCard";
import Loading from "../Utils/Loading";
import SidebarDeaddropView from "./SidebarDeaddropView";

export default function Sidebar(props) {
    const {
        deaddrops,
        loading,
        selectedDeaddrop,
        isDeaddropSelected,
        onMarkerSelect,
        backToMap,
    } = props;

    return (
        <>
            <div className="bg-dd-dark-C space-y-4 rounded-xl relative h-screen-dvh px-4 py-6 overflow-y-scroll">
                {isDeaddropSelected && (loading ? (
                    <div className="text-white flex items-center justify-center h-screen-dvh">
                        <Loading/>
                    </div>
                ) : (
                    <div className="w-full text-white">
                        <SidebarDeaddropView
                            deaddrop={selectedDeaddrop}
                            backToMap={backToMap}
                        />
                    </div>
                ))}

                {!isDeaddropSelected && !loading && (
                    deaddrops.map((deaddrop, index) => (
                        <a
                            className="block group"
                            key={index}
                            onClick={() => onMarkerSelect(deaddrop)}
                        >
                            <SidebarCard
                                deaddrop={deaddrop}
                            />
                        </a>
                    ))
                )}
            </div>
        </>
    );
}

Sidebar.propTypes = {
    deaddrops: PropTypes.array,
};

Sidebar.defaultProps = {
    deaddrops: [],
};
