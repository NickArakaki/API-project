import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { login } from '../../store/session'
import './LoginForm.css';

export default function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user)
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) {
        return <Redirect to="/" />
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.message) setErrors([data.message]);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, index) => <li className="error" key={index}>{error}</li>)}
            </ul>
            <label>
                Username/Email:
                <input required type="text" value={credential} onChange={(e) => setCredential(e.target.value)} />
            </label>
            <label>
                Password:
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Log In</button>
        </form>
    )
}
