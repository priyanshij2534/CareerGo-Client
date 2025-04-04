import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { startLoading, stopLoading } from "./loaderSlice"
import { setError } from "./errorSlice"
import { setSuccess } from "./messageSlice"
import successMessage from "../../utils/constants/successMessage"
import axios from "axios"
import config from "../../data/config"
import { selfIdentification } from "./userSlice"
import api from "../../utils/services/api"

const serverURL = config.SERVER_URL
const authURL = 'api/v1/auth'
const institutionURL = 'api/v1/institution'

const initialState = {
    isLoggedIn: false,
    data: null,
    token: null,
    code: null
}

export const registerUser = createAsyncThunk('auth/create', async (userPayload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.post(`${serverURL}/${authURL}/create`, userPayload)

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userRegister))

        return data

    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const registerInstitution = createAsyncThunk('auth/createInstitution', async (Payload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.post(`${serverURL}/${institutionURL}/create`, Payload)

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.institutionResgister))

        return data

    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const userLogin = createAsyncThunk('auth/login', async (loginPayload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.post(`${serverURL}/${authURL}/login`, loginPayload, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(selfIdentification())
        thunkAPI.dispatch(setSuccess(successMessage.userLogin))

        return data
    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

export const userLogout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await api.put(`/${authURL}/logout`)

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userLogout))

        return data
    } catch (error) {
        const errorMessage =
            api.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const forgetPassword = createAsyncThunk('auth/forgotPassword', async (Payload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.put(`${serverURL}/${authURL}/forgot-password?emailAddress=${Payload.emailAddress}`, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userForgotPassword))

        return data
    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (Payload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.put(`${serverURL}/${authURL}/reset-password/${Payload.token}`, Payload, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userResetPassword))

        return data
    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const verifyEmail = createAsyncThunk('auth/confirmation', async (Payload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.put(`${serverURL}/${authURL}/confirmation/${Payload.token}?code=${Payload.code}`, {}, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userVerifyEmail))

        return data
    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const ResendVerifyEmailLink = createAsyncThunk('auth/confirmation', async ({ emailAddress }, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.put(`${serverURL}/${authURL}/resend/email-verification?emailAddress=${emailAddress}`, {}, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userResendVerificationEmail))

        return data
    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (Payload, thunkAPI) => {
    try {
        thunkAPI.dispatch(startLoading())

        const { data } = await axios.put(`${serverURL}/${authURL}/change-password`, Payload, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        thunkAPI.dispatch(setSuccess(successMessage.userChangePassword))

        return data
    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    } finally {
        thunkAPI.dispatch(stopLoading())
    }
})

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
    try {
        const { data } = await axios.post(`${serverURL}/${authURL}/refresh-token`, {}, { withCredentials: true })

        if (!data.success) {
            thunkAPI.dispatch(setError(data.message))
            return thunkAPI.rejectWithValue(data.message)
        }

        return data

    } catch (error) {
        const errorMessage =
            axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Something went wrong'

        thunkAPI.dispatch(setError(errorMessage))
        return thunkAPI.rejectWithValue(errorMessage)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoggedIn: (state) => {
            state.isLoggedIn = true
        },
        setLoggedOut: (state) => {
            state.isLoggedIn = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.isLoggedIn = false
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.data = action.payload.data
            })
            .addCase(userLogin.rejected, (state) => {
                state.isLoggedIn = false
            })
            .addCase(userLogout.fulfilled, (state) => {
                state.isLoggedIn = false
                state.data = null
            })
    },
})

export const { setLoggedIn, setLoggedOut } = authSlice.actions

export default authSlice.reducer