import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setError } from '../store/slices/errorSlice'
import { registerUser } from '../store/slices/authSlice'
import { validateEmail, validatePassword } from '../utils/helper/syncHelper'
import signin_img from '../assets/signup.svg'
import logo from '../assets/logo.png'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { EUserRole } from '../utils/constants/applicationsEnum'
import { NavLink, useNavigate } from 'react-router-dom'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [conscent, setConscent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name) {
            const errorMessage = 'Name is required.'
            dispatch(setError(errorMessage))
            return
        } else if (!email) {
            const errorMessage = 'Email is required.'
            dispatch(setError(errorMessage))
            return
        } else if (!validateEmail(email)) {
            const errorMessage = 'Invalid email format.'
            dispatch(setError(errorMessage))
            return
        } else if (!password) {
            const errorMessage = 'Password is required.'
            dispatch(setError(errorMessage))
            return
        } else if (!validatePassword(password)) {
            const errorMessage =
                'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.'
            dispatch(setError(errorMessage))
            return
        } else if (!confirmPassword) {
            const errorMessage = 'Confirm password is required.'
            dispatch(setError(errorMessage))
            return
        } else if (password !== confirmPassword) {
            const errorMessage = 'Passwords do not match.'
            dispatch(setError(errorMessage))
            return
        } else if (!conscent) {
            const errorMessage = 'Please agree to terms and conditions'
            dispatch(setError(errorMessage))
            return
        }

        const payload = {
            name: name,
            emailAddress: email,
            password: password,
            conscent: conscent,
            role: EUserRole.USER,
        }

        const response = await dispatch(registerUser(payload))

        if (response.meta.requestStatus === 'fulfilled') {
            navigate('/sentEmail', { state: { SentEmailMessage: 'to verify the email', EmailAddress: email, IsEmailVerify: true } })
        }
    }

    return (
        <section className="flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-20 items-center md:mx-0 md:my-3">
            <div className="hidden md:block md:w-1/3 ">
                <img
                    className="h-96"
                    src={signin_img}
                    alt="signin"
                />
            </div>

            <div className="w-full md:w-1/3 max-w-sm">
                <NavLink to="/">
                    <img
                        src={logo}
                        alt="logo"
                        className="mb-2 mx-auto h-9 w-auto"
                    />
                </NavLink>
                <h2 className="text-gray-900 text-xl md:text-2xl font-bold tracking-tight mb-4">Start Your Journey with Us!</h2>
                <form
                    className="space-y-2"
                    onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900">
                            Name <span className="text-red-700">*</span>
                        </label>
                        <input
                            className="text-sm w-full px-4 py-2 border border-solid bg-gray-50 border-gray-300 rounded"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900">
                            Email <span className="text-red-700">*</span>
                        </label>
                        <input
                            className="text-sm w-full px-4 py-2 border border-solid bg-gray-50 border-gray-300 rounded"
                            type="text"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900">
                            Password <span className="text-red-700">*</span>
                        </label>
                        <div className="relative">
                            <input
                                className="text-sm w-full px-4 py-2 border border-solid bg-gray-50 border-gray-300 rounded"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setShowPassword(!showPassword)
                                    }
                                }}
                                aria-label="Toggle password visibility">
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block mb-2 text-sm font-medium text-gray-900">
                            Confirm Password <span className="text-red-700">*</span>
                        </label>
                        <div className="relative">
                            <input
                                className="text-sm w-full px-4 py-2 border border-solid bg-gray-50 border-gray-300 rounded"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                }}
                                aria-label="Toggle confirm password visibility">
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            className="mt-5 mb-2"
                            checked={conscent}
                            onChange={(e) => setConscent(e.target.checked)}
                        />
                        <label
                            htmlFor="conscent"
                            className="text-sm">
                            {' '}
                            Agree to terms and conditions{' '}
                        </label>
                    </div>
                    <div className="text-center md:text-left">
                        <button className="w-full bg-deep-blue text-white py-2 rounded-lg hover:bg-navy-blue transition">Sign Up</button>
                    </div>
                </form>
                <div className="mt-1 font-semibold text-sm text-slate-500 text-center md:text-left">
                    Already have an account?{' '}
                    <NavLink
                        className="text-deep-blue hover:underline hover:underline-offset-4"
                        to="/signin">
                        Sign in
                    </NavLink>
                </div>
                <div className="flex justify-center items-center font-inter my-5 text-dark-gray">
                    <hr className="w-8 border-dark-gray mr-2" />
                    or as an institution
                    <hr className="w-8 border-dark-gray ml-2" />
                </div>
                <div className="text-center md:text-left mb-3">
                    <button
                        onClick={() => navigate('/signupInstitution')}
                        className="w-full border border-deep-blue text-deep-blue py-2 rounded-lg hover:bg-deep-blue hover:text-white transition">
                        Sign Up as an institution
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Signup
