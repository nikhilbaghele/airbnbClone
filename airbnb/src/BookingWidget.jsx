/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [redirect, setRedirect] = useState("");
    const [errors, setErrors] = useState({});
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(
            new Date(checkOut),
            new Date(checkIn)
        );
    }

    function validateForm() {
        const errors = {};

        if (!checkIn) {
            errors.checkIn = "Check-in date is required.";
        }
        if (!checkOut) {
            errors.checkOut = "Check-out date is required.";
        } else if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
            errors.checkOut = "Check-out must be later than check-in.";
        }
        if (numberOfGuests <= 0) {
            errors.numberOfGuests = "Number of guests must be at least 1.";
        }
        if (!name.trim()) {
            errors.name = "Name is required.";
        }
        if (!phone.trim()) {
            errors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(phone)) {
            errors.phone = "Phone number must be 10 digits.";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function bookThisPlace() {
        if (!user) {
            alert("You need to be logged in to make a booking.");
            navigate("/login");
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post("/bookings", {
                checkIn,
                checkOut,
                numberOfGuests,
                name,
                phone,
                place: place._id,
                price: numberOfNights * place.price,
            });
            const bookingId = response.data._id;
            setRedirect(`/account/bookings/${bookingId}`);
        } catch (error) {
            alert("Booking failed. Please try again: ",error);
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <div className="bg-white shadow p-4 rounded-2xl">
                <div className="text-2xl text-center">
                    Price: &#8377;{place.price} / per night
                </div>
                <div className="border rounded-2xl mt-4">
                    <div className="flex">
                        <div className="py-3 px-4">
                            <label>Check in: </label>
                            <input
                                value={checkIn}
                                onChange={(ev) => setCheckIn(ev.target.value)}
                                type="date"
                                className={`border p-2 w-full rounded ${
                                    errors.checkIn ? "border-red-500" : ""
                                }`}
                            />
                            {errors.checkIn && <p className="text-red-500 text-xs">{errors.checkIn}</p>}
                        </div>
                        <div className="py-3 px-4 border-l">
                            <label>Check out: </label>
                            <input
                                value={checkOut}
                                onChange={(ev) => setCheckOut(ev.target.value)}
                                type="date"
                                className={`border p-2 w-full rounded ${
                                    errors.checkOut ? "border-red-500" : ""
                                }`}
                            />
                            {errors.checkOut && <p className="text-red-500 text-xs">{errors.checkOut}</p>}
                        </div>
                    </div>
                    <div className="py-3 px-4 border-t">
                        <label>Number of guests: </label>
                        <input
                            value={numberOfGuests}
                            onChange={(ev) => setNumberOfGuests(ev.target.value)}
                            type="number"
                            className={`border p-2 w-full rounded ${
                                errors.numberOfGuests ? "border-red-500" : ""
                            }`}
                        />
                        {errors.numberOfGuests && <p className="text-red-500 text-xs">{errors.numberOfGuests}</p>}
                    </div>
                    {numberOfGuests > 0 && (
                        <div className="py-3 px-4 border-t">
                            <label>Your full name:</label>
                            <input
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                                type="text"
                                className={`border p-2 w-full rounded ${
                                    errors.name ? "border-red-500" : ""
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

                            <label>Phone number:</label>
                            <input
                                value={phone}
                                onChange={(ev) => setPhone(ev.target.value)}
                                type="tel"
                                className={`border p-2 w-full rounded ${
                                    errors.phone ? "border-red-500" : ""
                                }`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                        </div>
                    )}
                </div>
                <button
                    onClick={bookThisPlace}
                    className={`primary mt-4 ${
                        Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={Object.keys(errors).length > 0}
                >
                    Book this place
                    {numberOfNights > 0 && <span> &#8377;{numberOfNights * place.price}</span>}
                </button>
            </div>
        </div>
    );
}
