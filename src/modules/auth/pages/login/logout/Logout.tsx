import {useEffect} from 'react'
import {Navigate, Routes} from 'react-router-dom'
import {useLogout} from "modules/auth/hooks/use-logout";

export function Logout() {
    const {logout} = useLogout()
    useEffect(() => {
        document.location.reload()
    }, [logout])

    return (
        <Routes>
            <Navigate to='/auth/login' replace/>
        </Routes>
    )
}
