import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from '../Layouts/RootLayout'
import { Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import PageNotFound from '../pages/PageNotFound'
import Signin from '../pages/Signin'
import Signup from '../pages/Signup'
import SignupInstitution from '../pages/SignupInstitution'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import SentEmail from '../pages/SentEmail'
import EmailVerification from '../pages/EmailVerification'

export const UnauthRouter = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route
                path="/signin"
                element={<Signin />}
            />
            <Route
                path="/signup"
                element={<Signup />}
            />
            <Route
                path="/signupInstitution"
                element={<SignupInstitution />}
            />
            <Route
                path="/forgotPassword"
                element={<ForgotPassword />}
            />
            <Route
                path="/sentEmail"
                element={<SentEmail />}
            />
            <Route
                path="/resetPassword/:token"
                element={<ResetPassword />}
            />
            <Route
                path="/confirmation/:token"
                element={<EmailVerification />}
            />

            <Route element={<RootLayout />}>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="about"
                    element={<About />}
                />
                <Route
                    path="contact"
                    element={<Contact />}
                />
                <Route
                    path="*"
                    element={<PageNotFound />}
                />
            </Route>
        </>
    )
)
