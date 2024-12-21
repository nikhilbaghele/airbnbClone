/* eslint-disable react/prop-types */
import { useState } from "react"
import Image from "./Image.jsx";

export default function PlaceGallery({ place }) {
    const [showAllPhotos, setShowAllPhotos] = useState(false)

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 text-white min-h-screen">
                <div className="p-8 grid gap-4 bg-black">
                    <div>
                        <h2 className="text-3xl">{place.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed flex right-2 top-8 gap-1 py-3 px-4 rounded-2xl shadow-black bg-white text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                            Close Photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                        <>
                            <div>
                            <Image src={photo} alt=""/>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        )       
    }

    return (
        <div className="relative">
            {/* 5-Photo Layout */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4 rounded-3xl overflow-hidden">
                {/* Large Image (Spans 2 Rows) */}
                {place.photos?.[0] && (
                    <div className="col-span-2 row-span-2 cursor-pointer">
                        <Image onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover"
                            src={place.photos[0]}
                            alt="Main Photo"
                        />
                    </div>
                )}

                {/* Top Right Image 1 */}
                {place.photos?.[1] && (
                    <div className="col-span-1 row-span-1">
                        <Image onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover"
                            src={place.photos[1]}
                            alt="Photo 1"
                        />
                    </div>
                )}

                {/* Top Right Image 2 */}
                {place.photos?.[2] && (
                    <div className="col-span-1 row-span-1">
                        <Image onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover"
                            src={place.photos[2]}
                            alt="Photo 2"
                        />
                    </div>
                )}

                {/* Bottom Right Image 1 */}
                {place.photos?.[3] && (
                    <div className="col-span-1 row-span-1">
                        <Image onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover"
                            src={place.photos[3]}
                            alt="Photo 3"
                        />
                    </div>
                )}

                {/* Bottom Right Image 2 */}
                {place.photos?.[4] && (
                    <div className="col-span-1 row-span-1">
                        <Image onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover"
                            src={place.photos[4]}
                            alt="Photo 4"
                        />
                    </div>
                )}
            </div>

            {/* Show More Photos Button */}
            <button onClick={() => setShowAllPhotos(true)} className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md shadow-gray-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                </svg>
                Show more photos
            </button>
        </div>
    )
}