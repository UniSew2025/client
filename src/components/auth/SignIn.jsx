import '../../styles/auth/SignIn.css'
import {SignInPage} from "@toolpad/core";
import {ReactRouterAppProvider} from "@toolpad/core/react-router";
import {Typography} from "@mui/material";
import {getGoogleUrl} from "../../services/AuthService.jsx";

/* init ui */
const brand = {
    logo: (
        <img
            src="/logo.png"
            alt="UniSew"
            width={50}
            height={50}
        />
    ),
    title: 'UniSew',
}

const providers = [
    { id: 'google', name: 'Google' }
]

function CustomSubtitle(){
    return (
        <Typography variant={"body2"} sx={{marginBottom: '2vh'}}>UniSew</Typography>
    )
}

function CustomTitle(){
    return (
        <Typography variant={"h4"} sx={{marginBottom: '0.5vh'}}>SIGN IN</Typography>
    )
}

const signIn = async () => {
    const response = await getGoogleUrl()
    if(response.status === 200 && response.data.data.url){
        window.location.href = response.data.data.url
    }
}

/* end init ui */

function RenderPage() {

    if(localStorage.length > 0) {
        localStorage.clear()
    }

    return (
        <div className="sign-in-container">
            <SignInPage
                providers={providers}
                slots={{
                    subtitle: CustomSubtitle,
                    title: CustomTitle,
                }}
                signIn={signIn}
            />
        </div>
    )
}

export default function SignIn() {

    return (
        <ReactRouterAppProvider branding={brand}>
            <RenderPage/>
        </ReactRouterAppProvider>
    )
}