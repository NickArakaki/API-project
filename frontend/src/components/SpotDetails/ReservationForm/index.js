import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateRange } from 'react-date-range';
import {formatDateYYYYMMDD} from "../../../utils/dates"
import { getListOfBookedDates } from '../../../utils/reservationUtils/dates';
import * as bookingActions from "../../../store/bookings"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './ReservationForm.css'
import { useParams } from 'react-router-dom';

function ReservationForm() {
    const sessionUser = useSelector(state => state.session.user)
    const calendarRef = useRef(null);
    const dispatch = useDispatch();
    const {spotId} = useParams()
    const bookings = useSelector(state => Object.values(state.bookings.spotBookings))
    const bookedDates = getListOfBookedDates(bookings)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const handleDateChange = item => {
        setDateRange([item.selection])
        // make a function to find the new max date based on
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReservation = {
            startDate: (dateRange[0].startDate),
            endDate: (dateRange[0].endDate)
        }
        // TODO: create custom validator for reservations

        // Direct user to booking confirmation page where they can pay
        // open a modal to confirm the payment and length of stay?
        dispatch(bookingActions.postSpotBookingThunk(spotId, newReservation))
    }

    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setShowDatePicker(false)
        }
    }

    const hideOnClick = (e) => {
        if (calendarRef.current && !calendarRef.current.contains(e.target)) {
            setShowDatePicker(false)
        }
    }

    // add event listeners
    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClick, true)
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            {/* <button type='button' onClick={() => setShowDatePicker(prev => !prev)}>Show Date Picker</button> */}
            <div className='date-container'>
                <div onClick={() => setShowDatePicker(prev => !prev)} className='date-div'>
                    Start Date: {formatDateYYYYMMDD(dateRange[0].startDate)}
                </div>
                <div onClick={() => setShowDatePicker(prev => !prev)} className='date-div'>
                    End Date: {formatDateYYYYMMDD(dateRange[0].endDate)}
                </div>
            </div>
            {/* TODO: useRef to close date range picker */}
            <div ref={calendarRef}>
            {showDatePicker && (
                <DateRange
                className="reservation-form-date-input"
                onChange={handleDateChange}
                ranges={dateRange}
                months={2}
                minDate={new Date()}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                direction="horizontal"
                disabledDates={bookedDates}
                rangeColors={["#ff767be6"]}
                />
                )}
            </div>
            {/* Enable submit button if the current user is not the owner of the spot */}
            <button type='submit'>Reserve</button>
        </form>
    )
}

export default ReservationForm;