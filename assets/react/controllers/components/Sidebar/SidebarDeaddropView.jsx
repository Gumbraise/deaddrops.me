import React from 'react';
import PropTypes from 'prop-types';

export default function SidebarDeaddropView(props) {
    const {
        deaddrop,
        backToMap,
    } = props;

    return (
        <div className="px-4">
            <div className="bg-dd-dark-A border-b-dd-dark-B flex justify-start py-8">
                <button
                    onClick={() => backToMap()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 24 24"
                         strokeWidth="1.5"
                         stroke="currentColor"
                         className="w-8 h-8 text-white">
                        <path strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </button>
            </div>
            <div className="space-y-4">
                <div className="bg-dd-dark-D px-4 py-8 space-y-8 rounded-xl">
                    <div className="space-y-3">
                        <p className="text-xl md:text-2xl font-bold">{deaddrop.name}</p>
                        <p className="text-xs">
                            Last updated: {deaddrop.updatedAtReadable} | {deaddrop.size}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-bold">About</p>
                        <p className="text-base">
                            {deaddrop.about}
                        </p>
                    </div>
                </div>
                {/*<div className="px-4 py-8 space-y-3">*/}
                {/*    <div className="space-y-2">*/}
                {/*        <p className="text-lg font-bold">Images</p>*/}
                {/*        <div className="w-full relative">*/}
                {/*            {deaddrop.images.map((image, index) => (*/}
                {/*                <div key={index} className="w-full bg-gray-500 rounded-xl">*/}
                {/*                    <img src={image.imagePath} className="rounded-xl"/>*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="bg-dd-dark-A px-4 py-8 space-y-8 rounded-xl">
                    <div className="space-y-2">
                        <p className="text-lg font-bold">Activity</p>
                        <p className="text-base">
                            {deaddrop.status.status} on {deaddrop.status.date}
                        </p>
                    </div>
                    <div className="space-y-4 divide-y divide-gray-700">
                        {deaddrop.activities.map((activity, index) => (
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <p className="text-base font-bold">{activity.author}</p>
                                    <p className="text-sm text-gray-300">{activity.status} on {activity.createdAtDMY}</p>
                                </div>
                                <p className="text-sm">
                                    {activity.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

SidebarDeaddropView.propTypes = {
    deaddrop: PropTypes.object.isRequired,
    backToMap: PropTypes.func.isRequired,
};

SidebarDeaddropView.defaultProps = {
    deaddrop: {},
    backToMap: () => {
    }
};