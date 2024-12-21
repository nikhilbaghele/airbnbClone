import { useEffect, useState } from "react";
import Perk from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState({ time: '', period: 'AM' });
    const [checkOut, setCheckOut] = useState({ time: '', period: 'AM' });
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    }, [id]);

    function validateForm() {
        if (!title) return "Title is required.";
        if (!address) return "Address is required.";
        if (addedPhotos.length === 0) return "At least one photo is required.";
        if (!description) return "Description is required.";
        if (perks.length === 0) return "Please select at least one perk.";
        if (!checkIn || !checkOut) return "Check-in and Check-out times are required.";
        if (maxGuests < 1) return "Number of guests must be at least 1.";
        if (price < 1) return "Price per night must be at least 1.";
        return null;
    }

    function convertTo24HourFormat(time, period) {
        const [hours, minutes] = time.split(':').map(Number);
        let hours24 = hours;
        if (period === "PM" && hours !== 12) {
            hours24 += 12;
        } else if (period === "AM" && hours === 12) {
            hours24 = 0;
        }
        return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn: convertTo24HourFormat(checkIn.time, checkIn.period),
            checkOut: convertTo24HourFormat(checkOut.time, checkOut.period),
            maxGuests,
            price,
        };

        if (id) {
            await axios.put('/places', { id, ...placeData });
        } else {
            await axios.post('/places', placeData);
        }
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />;
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {error && <div className="text-red-500 text-2xl mb-4 text-center">{error}</div>}

                <h2 className="text-2xl mt-4">Title</h2>
                <p className="text-gray-400 text-sm">Title for your place</p>
                <input
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}
                    type="text"
                    placeholder="Title, e.g., Lincoln Apartment"
                />

                <h2 className="text-2xl mt-4">Address</h2>
                <p className="text-gray-400 text-sm">Address to this place</p>
                <input
                    value={address}
                    onChange={ev => setAddress(ev.target.value)}
                    type="text"
                    placeholder="Address"
                />

                <h2 className="text-2xl mt-4">Photos</h2>
                <p className="text-gray-400 text-sm">Upload your photos</p>
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

                <h2 className="text-2xl mt-4">Description</h2>
                <p className="text-gray-400 text-sm">Description of the place</p>
                <textarea
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                />

                <h2 className="text-2xl mt-4">Perks</h2>
                <p className="text-gray-400 text-sm">Select all the perks of your place</p>
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perk selected={perks} onChange={setPerks} />
                </div>

                <h2 className="text-2xl mt-4">Extra Information</h2>
                <p className="text-gray-400 text-sm">Rules of your property</p>
                <textarea
                    value={extraInfo}
                    onChange={ev => setExtraInfo(ev.target.value)}
                />

                <h2 className="text-2xl mt-4">Check-in & Check-out Times</h2>
                <p className="text-gray-400 text-sm">
                    Add check-in and out times, ensure a cleaning window between guests
                </p>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check-in time</h3>
                        <div className="flex gap-2">
                            <input
                                value={checkIn.time}
                                onChange={(ev) => setCheckIn({ ...checkIn, time: ev.target.value })}
                                type="time"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check-out time</h3>
                        <div className="flex gap-2">
                            <input
                                value={checkOut.time}
                                onChange={(ev) => setCheckOut({ ...checkOut, time: ev.target.value })}
                                type="time"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input
                            value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)}
                            type="number"
                            min="1"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per Night</h3>
                        <input
                            value={price}
                            onChange={ev => setPrice(ev.target.value)}
                            type="number"
                            min="1"
                        />
                    </div>
                </div>

                <button className="primary my-4 hover:bg-red-600 transition duration-200">Save</button>
            </form>
        </div>
    );
}
