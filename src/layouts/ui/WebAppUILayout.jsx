import '../../styles/ui/WebAppUILayout.css'
import {Button, Divider, Link, Menu, MenuItem, Typography,} from "@mui/material";
import {AccountCircle, KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const existedUser = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).role === "school";
const userRole = existedUser ? JSON.parse(localStorage.getItem("user")).role : null;
const profileLink = userRole === 'school' ? '/school-profile'
    : userRole === 'designer' ? '/designer-profile'
        : userRole === 'garment' ? '/garment-profile'
            : '/';

function RenderFooterPolicyButton({link, title}) {
    const navigate = useNavigate()

    return (
        <Link
            component={"button"}
            variant={"body2"}
            underline={"none"}
            color={"textPrimary"}
            onClick={() => navigate(link)}
        >
            {title}
        </Link>
    )
}

function RenderHeaderButton({link, title}) {
    const navigate = useNavigate()

    return (
        <Button
            className={"btn-link"}
            variant={"text"}
            onClick={() => navigate(link)}
        >
            {title}
        </Button>
    )
}

function RenderHeaderMenuButton({title, children}) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (e) => {
        setAnchorEl(anchorEl === null ? e.currentTarget : null)
    }

    const handleCloseMenu = (link) => {
        if (link !== null) {
            navigate(link)
        }
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                className={"btn-link"}
                variant={"text"}
                onClick={handleClick}
                endIcon={open ? <KeyboardArrowUp fontSize={"medium"}/> : <KeyboardArrowDown fontSize={"large"}/>}
            >
                {title}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleCloseMenu(null)}
            >
                {
                    children.map((child, index) => (
                        <MenuItem key={index} onClick={() => handleCloseMenu(child.link)}>{child.title}</MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}

function RenderHeaderProfileButton({title, children}) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (e) => {
        setAnchorEl(anchorEl === null ? e.currentTarget : null)
    }

    const handleCloseMenu = (link) => {
        if (link !== null) {
            navigate(link)
        }
        setAnchorEl(null)
    }

    return (
        <>
            <Button
                className={"btn-link"}
                variant={"text"}
                onClick={handleClick}
                endIcon={<AccountCircle/>}
                sx={{color: "black"}}
            >
                {title}
            </Button>
            <Menu
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleCloseMenu(null)}
            >
                {
                    children.map((child, index) => (
                        <MenuItem key={index} onClick={() => handleCloseMenu(child.link)}>{child.title}</MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}

function RenderHeader() {
    const navigate = useNavigate()
    return (
        <div className="home-header">
            <img src={"/logo_full.png"} alt="UniSew"/>
            <div className="header-content">
                <RenderHeaderButton
                    link={"/home"}
                    title="Home"
                />
                {!existedUser && (
                    <RenderHeaderMenuButton
                        title="Become Partner"
                        children={[
                            {
                                link: '/partner/designer',
                                title: 'Join Designer'
                            },
                            {
                                link: '/partner/garment',
                                title: 'Join Garment Factory'
                            }
                        ]}
                    />
                )}
            </div>
            <div className="header-buttons">
                {!existedUser ? (
                    <Button variant={"outlined"} sx={{color: "black", borderColor: "black"}}
                            onClick={() => navigate("/sign-in")}>Sign in</Button>
                ) : (
                    <RenderHeaderProfileButton
                        title={
                            // JSON.parse(localStorage.getItem("user")).email
                            ""
                        }
                        children={
                            [
                                {
                                    link: profileLink,
                                    title: 'Profile'
                                },
                                {
                                    link: '/sign-in',
                                    title: 'Sign out'
                                }
                            ]
                        }
                    />
                )}

            </div>
        </div>
    )
}

function RenderFooter() {
    const today = new Date();

    return (
        <div className={"home-footer"}>
            <div className={"footer-content"}>
                <img src={"/logo_full.png"} alt="UniSew"/>
                <div className={"footer-item"}>
                    <Typography variant={"body1"} sx={{fontWeight: "bold", color: 'black'}}>About UniSew</Typography>
                    <RenderFooterPolicyButton title={"About us"} link={"/info/about"}/>
                    <RenderFooterPolicyButton title={"Contact us"} link={"/info/contact"}/>
                </div>
                <div className={"footer-item"}>
                    <Typography variant={"body1"} sx={{fontWeight: "bold", color: 'black'}}>Resources</Typography>
                    <RenderFooterPolicyButton title={"Order policy"} link={"/policy/order"}/>
                    <RenderFooterPolicyButton title={"Return policy"} link={"/policy/return"}/>
                    <RenderFooterPolicyButton title={"Privacy policy"} link={"/policy/privacy"}/>
                    <RenderFooterPolicyButton title={"Terms of service"} link={"/policy/term"}/>
                </div>
                <div className={"footer-item"}>
                    <Typography variant={"body1"} sx={{fontWeight: "bold", color: 'black'}}>Payment</Typography>
                    <img src={"/payos.png"} alt="PayOS"/>
                </div>
            </div>
            <Divider/>
            <div className={"footer-right"}>
                <span>&copy; {today.getFullYear()} UniSew, powered by UniSew team, All rights reserved.</span>
            </div>
        </div>
    )
}

function RenderPage({children, title}) {
    document.title = title;
    return (
        <div className={"home-main"}>
            <RenderHeader/>
            <div className={"home-body"}>
                {children}
            </div>
            <RenderFooter/>
        </div>
    )
}

export default function WebAppUILayout({children, title}) {
    return (
        <RenderPage children={children} title={title}/>
    )
}