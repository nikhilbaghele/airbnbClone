import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import AccountNav from "../AccountNav";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
    const [bookings, setBookings] = useState(null); // `null` initially
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/bookings')
            .then(response => {
                console.log("Bookings fetched:", response.data); // Log the fetched data
                setBookings(response.data || []); // Ensure it’s an array
            })
            .catch(error => {
                console.error("Error fetching bookings:", error);
                setBookings([]); // Fallback to empty array on error
            })
            .finally(() => {
                setIsLoading(false); // Loading complete
            });
    }, []);

    if (isLoading) {
        return (
            <div>
                <AccountNav />
                <div className="text-center text-gray-500 text-lg mt-8">Loading your bookings...</div>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div>
                <AccountNav />
                <div className="text-center text-gray-500 text-lg mt-8">
                    No bookings found. Start booking your next adventure now!
                </div>
            </div>
        );
    }

    return (
        <div>
            <AccountNav />
            <div>
                {bookings.map(booking => (
                    <Link
                        to={`/account/bookings/${booking._id}`}
                        key={booking._id}
                        className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-4"
                    >
                        <div className="w-52">
                            <PlaceImg place={booking.place} />
                        </div>
                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{booking.place?.title}</h2>
                            <div className="text-xl">
                                <BookingDates
                                    booking={booking}
                                    className="mb-2 mt-3 text-gray-500 items-center"
                                />
                                <div className="flex gap-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                                        />
                                    </svg>
                                    <span className="text-2xl">
                                        Total price: &#8377;{booking.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
