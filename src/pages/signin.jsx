import { useState } from 'react'
import '../styles/Auth.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import signin_img from '../assets/signin.svg'
import logo from '../assets/logo.png'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;

        if (!email) {
            setErrors((prev) => ({ ...prev, email: 'Email cannot be empty' }));
            valid = false;
        } else if (!validateEmail(email)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
            valid = false;
        } else {
            setErrors((prev) => ({ ...prev, email: '' }));
        }

        if (!password) {
            setErrors((prev) => ({ ...prev, password: 'Password cannot be empty' }));
            valid = false;
        } else if (!validatePassword(password)) {
            setErrors((prev) => ({
                ...prev,
                password: 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character',
            }));
            valid = false;
        } else {
            setErrors((prev) => ({ ...prev, password: '' }));
        }

        if (valid) {
            // console.log('Form Submitted', { email, password });
            // Perform your API call or action here
        }
    };

    return (
        <section className="auth h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-20 items-center md:mx-0 md:my-0">
            <div className="hidden md:block md:w-1/3 ">
                <img className='h-96' src={signin_img} alt="signin" />
            </div>

            <div className="w-full md:w-1/3 max-w-sm">
                <a href="/">
                    <img src={logo} alt="logo" className="mb-5 mx-auto h-9 w-auto" />
                </a>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <h2 className="text-gray-900 text-xl md:text-2xl font-bold tracking-tight">
                        Sign in to Your Account!
                    </h2>
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900">
                            Your email
                        </label>
                        <input
                            className="text-sm w-full px-4 py-2 border border-solid bg-gray-50 border-gray-300 rounded"
                            type="text"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900">
                            Password
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
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                    }
                                }}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>
                    <div className="flex justify-between font-semibold text-sm">
                        <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
                            <input className="mr-1" type="checkbox" />
                            <span>Remember Me</span>
                        </label>
                        <a
                            className="forgotPassword hover:underline hover:underline-offset-4"
                            href="/"
                        >
                            Forgot Password?
                        </a>
                    </div>
                    <div className="text-center md:text-left">
                        <button
                            className="authBtn w-full px-5 py-2 text-sm font-medium text-white rounded"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
                    Don&apos;t have an account?{' '}
                    <a
                        className="accountStatus hover:underline hover:underline-offset-4"
                        href="/"
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Login;

