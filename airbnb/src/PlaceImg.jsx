/* eslint-disable react/prop-types */
import Image from "./Image";

export default function PlaceImg({ place, index = 0, className = 'object-cover' }) {
    // Fallback for when `place` or `photos` is undefined or empty
    if (!place?.photos?.length) {
        return (
            <div className="bg-gray-300 h-full w-full rounded-2xl">
                No image available
            </div>
        );
    }

    // Ensure the index is within bounds
    const imageSrc = place.photos[index] || place.photos[0];

    return (
        <Image className={className} src={imageSrc} alt={place.title || "Place"} />
    );
}
